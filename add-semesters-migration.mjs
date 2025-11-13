import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

try {
    await sql`ALTER TABLE "courses" ADD COLUMN "semesters" integer GENERATED ALWAYS AS ("duration" * 2) STORED;`;
    console.log('✅ Successfully added semesters column to courses table');
    console.log('   The semesters column will automatically calculate as duration * 2');
} catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('already exists')) {
        console.log('   The semesters column already exists in the courses table');
    }
}
