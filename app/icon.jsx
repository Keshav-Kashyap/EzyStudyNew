import { ImageResponse } from 'next/og'
import { headers } from 'next/headers'

export const runtime = 'edge'

export const size = {
    width: 192,
    height: 192,
}

export const contentType = 'image/png'

export default async function Icon() {
    const headerStore = await headers()
    const host = headerStore.get('x-forwarded-host') || headerStore.get('host')
    const protocol = headerStore.get('x-forwarded-proto') || 'http'
    const origin = host ? `${protocol}://${host}` : ''

    return new ImageResponse(
        (
            <img
                src={`${origin}/Image.jpeg`}
                alt="Ezy Learn"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
        ),
        {
            ...size,
        }
    )
}
