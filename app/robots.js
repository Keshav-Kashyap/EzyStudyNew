import { siteConfig } from '@/lib/seo-config';

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin/', '/_next/'],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/', '/admin/'],
            },
        ],
        sitemap: `${siteConfig.url}/sitemap.xml`,
        host: siteConfig.url,
    };
}
