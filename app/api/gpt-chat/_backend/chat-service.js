import { extractAttachmentText } from './attachments';
import { callGroqChat } from './groq-client';

function sanitizeHistory(history = []) {
    if (!Array.isArray(history)) return [];

    return history
        .filter((item) => item && typeof item.content === 'string' && typeof item.role === 'string')
        .map((item) => ({
            role: item.role === 'assistant' ? 'assistant' : 'user',
            content: item.content,
        }))
        .slice(-20);
}

function buildEnhancedMessage({ safeMessage, safeAttachments, extractedAttachmentText, extractionNotes }) {
    const attachmentSummary = safeAttachments
        .map((file, index) => `- File ${index + 1}: ${file?.name || 'Unnamed'} (${file?.type || 'unknown'})`)
        .join('\n');

    return [
        safeMessage.trim() || 'Please analyze the attached files and answer the user query.',
        attachmentSummary ? `\nAttached files:\n${attachmentSummary}` : '',
        extractedAttachmentText ? `\nExtracted text from attached files:\n${extractedAttachmentText}` : '',
        extractionNotes.length ? `\nExtraction notes:\n${extractionNotes.map((note) => `- ${note}`).join('\n')}` : '',
        safeAttachments.length && !extractedAttachmentText
            ? '\nNo attachment text could be extracted. Ask the user for a clearer image or a text-based PDF.'
            : '',
    ]
        .filter(Boolean)
        .join('\n');
}

export async function processGroqChatRequest(payload) {
    const { message, context, history = [], attachments = [] } = payload || {};

    const safeMessage = typeof message === 'string' ? message : '';
    const safeContext = typeof context === 'string' ? context : '';
    const safeHistory = sanitizeHistory(history);
    const safeAttachments = Array.isArray(attachments) ? attachments : [];

    console.info('[gpt-chat][service] incoming', {
        hasMessage: Boolean(safeMessage.trim()),
        contextChars: safeContext.length,
        historyCount: safeHistory.length,
        attachmentCount: safeAttachments.length,
    });

    if (!safeMessage.trim() && !safeAttachments.length) {
        return {
            status: 400,
            body: { ok: false, error: 'Message or attachment is required' },
        };
    }

    let extractedAttachmentText = '';
    let extractionNotes = [];

    if (safeAttachments.length) {
        try {
            const extractionResult = await extractAttachmentText(safeAttachments);
            extractedAttachmentText = extractionResult.extractedText;
            extractionNotes = extractionResult.extractionNotes;
            console.info('[gpt-chat][service] extraction-result', {
                extractedChars: extractedAttachmentText.length,
                notes: extractionNotes,
            });
        } catch (extractError) {
            extractionNotes = [`Attachment extraction failed: ${extractError.message}`];
            console.error('[gpt-chat][service] extraction-error', {
                error: extractError.message,
            });
        }
    }

    const enhancedMessage = buildEnhancedMessage({
        safeMessage,
        safeAttachments,
        extractedAttachmentText,
        extractionNotes,
    });

    console.info('[gpt-chat][service] prompt-ready', {
        enhancedMessageChars: enhancedMessage.length,
        includesExtractedText: Boolean(extractedAttachmentText),
        extractedPreview: extractedAttachmentText ? extractedAttachmentText.slice(0, 200) : '',
    });

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
        return {
            status: 500,
            body: { ok: false, error: 'GROQ_API_KEY not configured in environment variables' },
        };
    }

    try {
        const reply = await callGroqChat({
            message: enhancedMessage,
            context: safeContext,
            history: safeHistory,
            apiKey: groqApiKey,
        });

        console.info('[gpt-chat][service] groq-success', {
            replyChars: typeof reply === 'string' ? reply.length : 0,
        });

        return {
            status: 200,
            body: {
                ok: true,
                reply,
                provider: 'groq',
            },
        };
    } catch (apiError) {
        return {
            status: 502,
            body: {
                ok: false,
                error: 'AI service unavailable',
                details: apiError.message,
            },
        };
    }
}
