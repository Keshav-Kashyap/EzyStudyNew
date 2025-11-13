import { siteConfig } from '@/lib/seo-config';

export default function sitemap() {
    const baseUrl = siteConfig.url;

    // Static routes
    const routes = [
        '',
        '/dashboard',
        '/library',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: route === '' ? 1 : 0.8,
    }));

    // Course routes
    const courses = ['MCA', 'BCA', 'BTECH'];
    const courseRoutes = courses.map((course) => ({
        url: `${baseUrl}/library/${course}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    // Semester routes (example)
    const semesterRoutes = courses.flatMap((course) =>
        Array.from({ length: 6 }, (_, i) => ({
            url: `${baseUrl}/library/${course}/semester/semester-${i + 1}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: 0.6,
        }))
    );

    return [...routes, ...courseRoutes, ...semesterRoutes];
}
