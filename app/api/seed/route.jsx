import { db } from "@/config/db";
import { courses, semesters, subjects, resources } from "@/drizzel/schema";
import { NextResponse } from "next/server";

export async function GET() {
    return seedDatabase();
}

export async function POST() {
    return seedDatabase();
}

async function seedDatabase() {
    try {
        // Insert sample courses
        const courseData = await db.insert(courses).values([
            {
                code: 'mca',
                name: 'Master of Computer Applications',
                description: 'A comprehensive 3-year program covering advanced computer applications and software development.',
                semesters: 6,
                likes: 250,
                downloads: 1200
            },
            {
                code: 'bca',
                name: 'Bachelor of Computer Applications',
                description: 'A 3-year undergraduate program focusing on computer applications and programming.',
                semesters: 6,
                likes: 180,
                downloads: 950
            },
            {
                code: 'btech',
                name: 'Bachelor of Technology',
                description: '4-year engineering program with specializations in various fields.',
                semesters: 8,
                likes: 320,
                downloads: 1500
            }
        ]).returning();

        console.log('Courses inserted:', courseData);

        // Insert semesters for each course
        const semesterData = [];
        for (const course of courseData) {
            for (let i = 1; i <= course.semesters; i++) {
                semesterData.push({
                    courseId: course.id,
                    semesterNumber: i,
                    totalSubjects: i <= 4 ? 6 : 5  // Example: First 4 semesters have 6 subjects, later ones have 5
                });
            }
        }

        const insertedSemesters = await db.insert(semesters).values(semesterData).returning();
        console.log('Semesters inserted:', insertedSemesters.length);

        // Insert sample subjects for MCA 1st semester
        const mcaCourse = courseData.find(c => c.code === 'mca');
        const mcaSem1 = insertedSemesters.find(s => s.courseId === mcaCourse.id && s.semesterNumber === 1);

        if (mcaSem1) {
            const subjectData = await db.insert(subjects).values([
                {
                    semesterId: mcaSem1.id,
                    name: 'Programming Fundamentals',
                    code: 'MCA101',
                    description: 'Introduction to programming concepts and C language'
                },
                {
                    semesterId: mcaSem1.id,
                    name: 'Computer Organization',
                    code: 'MCA102',
                    description: 'Basic computer architecture and organization'
                },
                {
                    semesterId: mcaSem1.id,
                    name: 'Discrete Mathematics',
                    code: 'MCA103',
                    description: 'Mathematical foundations for computer science'
                },
                {
                    semesterId: mcaSem1.id,
                    name: 'Database Management Systems',
                    code: 'MCA104',
                    description: 'Introduction to database concepts and SQL'
                },
                {
                    semesterId: mcaSem1.id,
                    name: 'Web Technologies',
                    code: 'MCA105',
                    description: 'HTML, CSS, JavaScript fundamentals'
                },
                {
                    semesterId: mcaSem1.id,
                    name: 'Statistics for Computer Science',
                    code: 'MCA106',
                    description: 'Statistical methods and probability theory'
                }
            ]).returning();

            console.log('Subjects inserted:', subjectData);

            // Insert sample resources for Programming Fundamentals
            const progFundamentals = subjectData.find(s => s.code === 'MCA101');
            if (progFundamentals) {
                await db.insert(resources).values([
                    {
                        subjectId: progFundamentals.id,
                        title: 'C Programming Notes - Chapter 1',
                        fileUrl: 'https://example.com/files/c-programming-ch1.pdf',
                        fileType: 'pdf',
                        downloads: 45
                    },
                    {
                        subjectId: progFundamentals.id,
                        title: 'Programming Practice Problems',
                        fileUrl: 'https://example.com/files/programming-problems.pdf',
                        fileType: 'pdf',
                        downloads: 32
                    },
                    {
                        subjectId: progFundamentals.id,
                        title: 'Lab Manual - Programming Fundamentals',
                        fileUrl: 'https://example.com/files/lab-manual-prog.pdf',
                        fileType: 'pdf',
                        downloads: 28
                    }
                ]);

                console.log('Resources inserted for Programming Fundamentals');
            }
        }

        return NextResponse.json({
            message: " Database seeding completed successfully!",
            data: {
                courses: courseData.length,
                semesters: insertedSemesters.length,
                subjects: 6,
                resources: 3
            }
        });

    } catch (error) {
        console.error(' Error seeding database:', error);
        return NextResponse.json({
            error: "Failed to seed database",
            details: error.message
        }, { status: 500 });
    }
}