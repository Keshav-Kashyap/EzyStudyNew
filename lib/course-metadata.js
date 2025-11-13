import { generateMetadata as generateSeoMetadata, generateCourseJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo-config';

export async function generateMetadata({ params }) {
    const { code } = await params;
    const courseName = code.toUpperCase();

    const courseDescriptions = {
        MCA: "Master of Computer Applications (MCA) study materials, notes, and resources. Download comprehensive notes for all MCA semesters.",
        BCA: "Bachelor of Computer Applications (BCA) study materials, notes, and resources. Access complete BCA course materials and exam preparation notes.",
        BTECH: "Bachelor of Technology (BTech) engineering notes, study materials, and resources. Download subject-wise notes for all BTech semesters.",
    };

    const description = courseDescriptions[courseName] || `Access comprehensive study materials, notes, and resources for ${courseName} course.`;

    return generateSeoMetadata({
        title: `${courseName} Course - Study Materials & Notes`,
        description,
        url: `/library/${code}`,
        keywords: [
            `${courseName} notes`,
            `${courseName} study materials`,
            `${courseName} course`,
            `${courseName} syllabus`,
            `${courseName} semester notes`,
            `${courseName} exam preparation`,
            'download notes',
            'free study materials',
        ],
    });
}

export { generateCourseJsonLd, generateBreadcrumbJsonLd };
