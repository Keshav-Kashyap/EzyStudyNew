import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'EzyLearn - Your Ultimate Learning Companion'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                <div style={{ fontSize: 80, fontWeight: 'bold' }}>EzyLearn</div>
                <div style={{ fontSize: 40, marginTop: 20 }}>Your Ultimate Learning Companion</div>
            </div>
        ),
        {
            ...size,
        }
    )
}
