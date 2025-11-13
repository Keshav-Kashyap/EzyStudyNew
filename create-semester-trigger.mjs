import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function createSemesterTrigger() {
    try {
        console.log('🚀 Creating automatic semester generation system...\n');

        // Step 1: Create function to generate semesters
        console.log('1️⃣ Creating function to auto-generate semesters...');
        await sql`
            CREATE OR REPLACE FUNCTION generate_semesters_for_course()
            RETURNS TRIGGER AS $$
            DECLARE
                semester_count INTEGER;
                i INTEGER;
                semester_name TEXT;
                semester_description TEXT;
            BEGIN
                -- Calculate semester count (duration * 2)
                semester_count := NEW.duration * 2;
                
                -- Delete existing semesters for this course category if updating
                DELETE FROM semesters WHERE category = NEW.category;
                
                -- Generate semesters
                FOR i IN 1..semester_count LOOP
                    semester_name := 'Semester ' || i;
                    semester_description := 'Semester ' || i || ' of ' || NEW.title || ' course';
                    
                    INSERT INTO semesters (category, name, description, "isActive")
                    VALUES (NEW.category, semester_name, semester_description, false);
                END LOOP;
                
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `;
        console.log('   ✅ Function created successfully\n');

        // Step 2: Create trigger for INSERT
        console.log('2️⃣ Creating trigger for new courses...');
        await sql`
            DROP TRIGGER IF EXISTS trigger_generate_semesters_insert ON courses;
        `;
        await sql`
            CREATE TRIGGER trigger_generate_semesters_insert
            AFTER INSERT ON courses
            FOR EACH ROW
            EXECUTE FUNCTION generate_semesters_for_course();
        `;
        console.log('   ✅ INSERT trigger created successfully\n');

        // Step 3: Create trigger for UPDATE
        console.log('3️⃣ Creating trigger for course updates...');
        await sql`
            DROP TRIGGER IF EXISTS trigger_generate_semesters_update ON courses;
        `;
        await sql`
            CREATE TRIGGER trigger_generate_semesters_update
            AFTER UPDATE OF duration ON courses
            FOR EACH ROW
            WHEN (OLD.duration IS DISTINCT FROM NEW.duration)
            EXECUTE FUNCTION generate_semesters_for_course();
        `;
        console.log('   ✅ UPDATE trigger created successfully\n');

        // Step 4: Generate semesters for existing courses
        console.log('4️⃣ Generating semesters for existing courses...');
        const existingCourses = await sql`
            SELECT id, category, title, duration FROM courses WHERE duration IS NOT NULL;
        `;

        for (const course of existingCourses) {
            const semesterCount = course.duration * 2;

            // Delete existing semesters for this category
            await sql`DELETE FROM semesters WHERE category = ${course.category}`;

            // Create new semesters
            for (let i = 1; i <= semesterCount; i++) {
                const semesterName = `Semester ${i}`;
                const semesterDescription = `Semester ${i} of ${course.title} course`;

                await sql`
                    INSERT INTO semesters (category, name, description, "isActive")
                    VALUES (${course.category}, ${semesterName}, ${semesterDescription}, false)
                `;
            }

            console.log(`   ✅ Created ${semesterCount} semesters for ${course.title}`);
        }

        console.log('\n🎉 SUCCESS! Automatic semester generation system is now active!');
        console.log('\n📝 What happens now:');
        console.log('   • When you create a new course, semesters will auto-generate');
        console.log('   • When you update course duration, semesters will regenerate');
        console.log('   • Semester naming: "Semester 1", "Semester 2", etc.');
        console.log('   • All semesters are created with isActive = false by default');
        console.log('   • Category is set to the course category');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Full error:', error);
    }
}

createSemesterTrigger();
