import { NextResponse } from 'next/server'

export async function POST(req) {
    try {
        const { url } = await req.json()

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 })
        }

        // Fetch the file from the provided URL
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        })

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch file' }, { status: response.status })
        }

        // Get the file as array buffer
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Get content type, default to PDF
        const contentType = response.headers.get('Content-Type') || 'application/pdf'

        // Return the file with appropriate headers
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': 'attachment; filename="document.pdf"',
                'Content-Length': buffer.length.toString(),
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Cache-Control': 'no-cache',
            },
        })
    } catch (error) {
        console.error('Proxy error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    })
}
