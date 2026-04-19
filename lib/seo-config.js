/**
 * Centralized SEO Configuration
 * All meta tags, Open Graph, Twitter Cards, and structured data
 */

export const siteConfig = {
    name: "Ezy Learn",
    title: "Ezy Learn - Free Study Materials, Notes & PDFs for MCA, BCA & BTech Students",
    description: "Download free study materials, lecture notes, PDF documents, and exam preparation resources for MCA, BCA, and BTech courses. Access 500+ materials with proper study structure and best YouTube channel recommendations.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ezylearn.vercel.app",
    ogImage: "/og-image.png",
    links: {
        twitter: "https://twitter.com/ezylearn",
        github: "https://github.com/Keshav-Kashyap/EzyStudyNew",
        linkedin: "https://linkedin.com/company/ezylearn",
    },
    creator: {
        name: "Ezy Learn Team",
        url: "https://ezylearn.vercel.app",
        twitter: "@ezylearn",
    },
    keywords: [
        // Primary Keywords
        "study materials",
        "free notes download",
        "lecture notes PDF",
        "exam preparation",
        "online learning platform",

        // Course-specific Keywords
        "MCA notes",
        "MCA study material",
        "Master of Computer Applications notes",
        "BCA notes",
        "BCA study material",
        "Bachelor of Computer Applications notes",
        "BTech notes",
        "BTech study material",
        "engineering notes",

        // Subject-specific Keywords
        "computer science notes",
        "data structures notes",
        "algorithm notes",
        "database management notes",
        "operating system notes",
        "computer networks notes",
        "software engineering notes",
        "programming notes",

        // Feature Keywords
        "semester-wise notes",
        "subject-wise notes",
        "study structure",
        "YouTube channel recommendations",
        "complete syllabus",
        "exam patterns",

        // Academic Keywords
        "university notes",
        "college notes",
        "educational resources",
        "learning management",
        "study guide",
        "revision notes",
        "quick notes",

        // India-specific
        "Indian university notes",
        "AKTU notes",
        "Mumbai University notes",
        "Delhi University notes",
    ],
    structuredData: {
        organization: {
            name: "Ezy Learn",
            legalName: "Ezy Learn Educational Platform",
            description: "Free educational platform providing study materials and notes for students",
            foundingDate: "2024",
            email: "support@ezylearn.com",
        },
        statistics: {
            students: "10000+",
            materials: "500+",
            subjects: "50+",
            courses: "3",
        }
    }
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
            icon: "/Image.jpeg",
            shortcut: "/Image.jpeg",
            apple: "/Image.jpeg",
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
 * Generate Course JSON-LD with enhanced educational details
 */
export const generateCourseJsonLd = ({
    name,
    description,
    provider = "Ezy Learn",
    category,
    url,
    courseCode,
    numberOfSemesters,
}) => {
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        name,
        description,
        url: `${siteConfig.url}${url}`,
        provider: {
            "@type": "EducationalOrganization",
            name: provider,
            url: siteConfig.url,
            logo: `${siteConfig.url}/logo.png`
        },
        educationalLevel: "Higher Education",
        inLanguage: "en-IN",
        availableLanguage: ["English", "Hindi"],
        courseCode: courseCode || category,
        numberOfCredits: numberOfSemesters,
        coursePrerequisites: "Basic understanding of the subject",
        learningResourceType: "Study Materials",
        educationalUse: "Self-paced Learning",
        hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: ["Online", "Self-paced"],
            courseWorkload: "PT48H",
            instructor: {
                "@type": "Organization",
                name: "Ezy Learn"
            }
        },
        about: {
            "@type": "Thing",
            name: category || name,
            description: `Comprehensive study materials for ${name}`
        },
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            category: "Free"
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.7",
            ratingCount: "350"
        }
    };
};

/**
 * Generate Organization JSON-LD with enhanced data
 */
export const generateOrganizationJsonLd = () => {
    return {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: siteConfig.name,
        alternateName: "Ezy Learn Platform",
        description: siteConfig.description,
        url: siteConfig.url,
        logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}/logo.png`,
            width: "250",
            height: "60"
        },
        image: `${siteConfig.url}/og-image.png`,
        sameAs: [
            siteConfig.links.twitter,
            siteConfig.links.github,
            siteConfig.links.linkedin
        ],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Support",
            email: siteConfig.structuredData.organization.email,
            availableLanguage: ["English", "Hindi"]
        },
        address: {
            "@type": "PostalAddress",
            addressCountry: "IN"
        },
        areaServed: "IN",
        knowsAbout: [
            "Computer Science Education",
            "MCA Course",
            "BCA Course",
            "BTech Engineering",
            "Study Materials",
            "Educational Resources"
        ]
    };
};

/**
 * Generate WebSite JSON-LD with SearchAction
 */
export const generateWebsiteJsonLd = () => {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        alternateName: "Ezy Learn",
        url: siteConfig.url,
        description: siteConfig.description,
        publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            logo: {
                "@type": "ImageObject",
                url: `${siteConfig.url}/logo.png`
            }
        },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteConfig.url}/library?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
};

/**
 * Generate Educational Platform JSON-LD
 */
export const generateEducationalPlatformJsonLd = () => {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock"
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "1250",
            bestRating: "5",
            worstRating: "1"
        },
        featureList: [
            "Free Study Materials",
            "Semester-wise Notes",
            "PDF Downloads",
            "Subject Organization",
            "YouTube Recommendations",
            "Complete Syllabus Coverage"
        ]
    };
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
