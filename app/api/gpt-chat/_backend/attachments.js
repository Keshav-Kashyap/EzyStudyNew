import { PDFParse } from 'pdf-parse';

const MAX_ATTACHMENTS = 3;
const MAX_EXTRACTED_CHARS = 12000;

function normalizeAttachment(attachment = {}) {
    const { name = 'file', type = 'application/octet-stream', dataUrl = '' } = attachment;
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
        return null;
    }

    const parts = dataUrl.split(',');
    if (parts.length < 2) return null;

    const meta = parts[0] || '';
    const base64Data = parts.slice(1).join(',');
    const matchedMime = meta.match(/^data:([^;]+);base64$/i);

    return {
        name,
        mimeType: matchedMime?.[1] || type || 'application/octet-stream',
        base64Data,
    };
}

async function extractTextFromPdfBase64(base64Data) {
    const parser = new PDFParse({
        data: Buffer.from(base64Data, 'base64'),
    });

    try {
        const result = await parser.getText();
        return (result?.text || '').replace(/\s+\n/g, '\n').trim();
    } finally {
        await parser.destroy();
    }
}

export async function extractAttachmentText(attachments = []) {
    const normalized = attachments.map(normalizeAttachment).filter(Boolean).slice(0, MAX_ATTACHMENTS);
    const extractionNotes = [];
    const extractedSections = [];

    console.info('[gpt-chat][extract] start', {
        received: attachments.length,
        normalized: normalized.length,
    });

    for (const file of normalized) {
        try {
            let text = '';
            console.info('[gpt-chat][extract] file', {
                name: file.name || 'file',
                mimeType: file.mimeType,
            });

            if (file.mimeType === 'application/pdf') {
                text = await extractTextFromPdfBase64(file.base64Data);
            } else if (file.mimeType.startsWith('image/')) {
                extractionNotes.push(`${file.name || 'file'}: image local extraction is not supported`);
                console.info('[gpt-chat][extract] skipped-image', {
                    name: file.name || 'file',
                });
                continue;
            }

            if (text) {
                extractedSections.push(`File: ${file.name || 'Unnamed'}\n${text.slice(0, MAX_EXTRACTED_CHARS)}`);
                extractionNotes.push(`${file.name || 'file'}: local extraction successful`);
                console.info('[gpt-chat][extract] success', {
                    name: file.name || 'file',
                    chars: text.length,
                    preview: text.slice(0, 180),
                });
            } else {
                extractionNotes.push(`${file.name || 'file'}: no text extracted locally`);
                console.info('[gpt-chat][extract] empty', {
                    name: file.name || 'file',
                });
            }
        } catch (error) {
            extractionNotes.push(`${file.name || 'file'}: local extraction failed (${error.message})`);
            console.error('[gpt-chat][extract] failed', {
                name: file.name || 'file',
                error: error.message,
            });
        }
    }

    const extractedText = extractedSections.join('\n\n').trim();
    console.info('[gpt-chat][extract] done', {
        extractionNotes,
        extractedChars: extractedText.length,
    });

    return {
        extractedText,
        extractionNotes,
    };
}
