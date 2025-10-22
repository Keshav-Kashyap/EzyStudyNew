import { neon } from '@neondatabase/serverless';

// Direct database URL
const DATABASE_URL = "postgresql://neondb_owner:npg_Bhzcpm5ER1Sk@ep-young-king-ad4g98a2-pooler.c-2.us-east-1.aws.neon.tech/Ai-ezy_learn?sslmode=require&channel_binding=require";

async function addDurationColumn() {
    try {
        console.log('🔄 Adding duration column to courses table...');
        console.log('🔗 Connecting to Neon database...');

        const sql = neon(DATABASE_URL);

        // Add duration column and remove studentsCount column
        console.log('📝 Updating courses table schema...');

        // Add duration column (default 3 years)
        await sql`ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration integer DEFAULT 3`;
        console.log('✅ Added duration column');

        // Remove studentsCount column if it exists
        try {
            await sql`ALTER TABLE courses DROP COLUMN IF EXISTS "studentsCount"`;
            console.log('✅ Removed studentsCount column');
        } catch (error) {
            console.log('ℹ️  studentsCount column might not exist');
        }

        // Update existing courses to have default duration
        await sql`UPDATE courses SET duration = 3 WHERE duration IS NULL`;
        console.log('✅ Updated existing courses with default duration');

        console.log('\n🎉 Database migration completed!');
        console.log('📊 Courses table now has:');
        console.log('   - duration column (years)');
        console.log('   - no studentsCount column');

    } catch (error) {
        console.error('❌ Error during migration:', error);
        throw error;
    }
}

// Run the migration
addDurationColumn()
    .then(() => {
        console.log('\n🚀 Migration completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    });