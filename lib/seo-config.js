/**
 * Centralized SEO Configuration
 * All meta tags, Open Graph, Twitter Cards, and structured data
 */

export const siteConfig = {
    name: "EzyLearn",
    title: "EzyLearn - Your Ultimate Learning Companion",
    description: "Access comprehensive study materials, notes, and PDFs for MCA, BCA, and BTech courses. Download notes, practice materials, and get exam-ready with EzyLearn.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ezylearn.com",
    ogImage: "/images/og-image.jpg",
    links: {
        twitter: "https://twitter.com/ezylearn",
        github: "https://github.com/yourusername/ezylearn",
    },
    creator: {
        name: "EzyLearn Team",
        url: "https://ezylearn.com",
    },
    keywords: [
        "online learning",
        "study materials",
        "MCA notes",
        "BCA notes",
        "BTech notes",
        "exam preparation",
        "study notes",
        "educational platform",
        "learning management system",
        "PDF notes download",
        "computer science notes",
        "engineering notes",
    ],
};

/**
 * Generate metadata for specific pages
 */
export const generateMetadata = ({
    title,
    description,
    image,
    url,
    type = "website",
    keywords = [],
}) => {
    const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
    const fullDescription = description || siteConfig.description;
    const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
    const fullImage = image || siteConfig.ogImage;
    const allKeywords = [...siteConfig.keywords, ...keywords].join(", ");

    return {
        title: fullTitle,
        description: fullDescription,
        keywords: allKeywords,
        authors: [{ name: siteConfig.creator.name, url: siteConfig.creator.url }],
        creator: siteConfig.creator.name,
        publisher: siteConfig.name,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: fullUrl,
        },
        openGraph: {
            type: type,
            locale: "en_US",
            url: fullUrl,
            title: fullTitle,
            description: fullDescription,
            siteName: siteConfig.name,
            images: [
                {
                    url: fullImage,
                    width: 1200,
                    height: 630,
                    alt: fullTitle,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description: fullDescription,
            images: [fullImage],
            creator: "@ezylearn",
            site: "@ezylearn",
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        icons: {
            icon: "/favicon.ico",
            shortcut: "/favicon-16x16.png",
            apple: "/apple-touch-icon.png",
        },
        manifest: "/site.webmanifest",
    };
};

/**
 * Generate JSON-LD structured data
 */
export const generateJsonLd = ({
    type = "WebSite",
    name,
    description,
    url,
    image,
    additionalData = {},
}) => {
    const baseData = {
        "@context": "https://schema.org",
        "@type": type,
        name: name || siteConfig.name,
        description: description || siteConfig.description,
        url: url || siteConfig.url,
        image: image || siteConfig.ogImage,
        ...additionalData,
    };

    return baseData;
};

/**
 * Generate Course JSON-LD
 */
export const generateCourseJsonLd = ({
    name,
    description,
    provider = "EzyLearn",
    category,
    url,
}) => {
    return generateJsonLd({
        type: "Course",
        name,
        description,
        url,
        additionalData: {
            provider: {
                "@type": "Organization",
                name: provider,
                url: siteConfig.url,
            },
            educationalLevel: "Higher Education",
            coursePrerequisites: "None",
            hasCourseInstance: {
                "@type": "CourseInstance",
                courseMode: "Online",
                courseWorkload: "Self-paced",
            },
            ...(category && { about: category }),
        },
    });
};

/**
 * Generate Organization JSON-LD
 */
export const generateOrganizationJsonLd = () => {
    return generateJsonLd({
        type: "Organization",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        additionalData: {
            logo: `${siteConfig.url}/logo.png`,
            sameAs: [siteConfig.links.twitter, siteConfig.links.github],
            contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                email: "support@ezylearn.com",
            },
        },
    });
};

/**
 * Generate BreadcrumbList JSON-LD
 */
export const generateBreadcrumbJsonLd = (items) => {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url ? `${siteConfig.url}${item.url}` : undefined,
        })),
    };
};
