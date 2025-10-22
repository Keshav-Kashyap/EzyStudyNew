import { neon } from '@neondatabase/serverless';

// Direct database URL from your .env file
const DATABASE_URL = "postgresql://neondb_owner:npg_Bhzcpm5ER1Sk@ep-young-king-ad4g98a2-pooler.c-2.us-east-1.aws.neon.tech/Ai-ezy_learn?sslmode=require&channel_binding=require";

async function dropAdminTables() {
    try {
        console.log('🗑️  Starting admin tables cleanup...');
        console.log('🔗 Connecting to Neon database...');

        // Create database connection
        const sql = neon(DATABASE_URL);

        // List of admin tables to drop
        const adminTables = [
            'admin_courses',
            'admin_semesters',
            'admin_subjects',
            'admin_materials'
        ];

        console.log('📋 Admin tables to drop:', adminTables);

        // Drop each admin table if it exists
        for (const tableName of adminTables) {
            try {
                console.log(`🔄 Dropping table: ${tableName}`);

                // Use proper SQL syntax for Neon
                const result = await sql`DROP TABLE IF EXISTS ${sql.unsafe(tableName)} CASCADE`;

                console.log(`✅ Successfully dropped: ${tableName}`);
            } catch (error) {
                if (error.message.includes('does not exist')) {
                    console.log(`ℹ️  Table ${tableName} doesn't exist (already clean)`);
                } else {
                    console.warn(`⚠️  Warning: Could not drop ${tableName}:`, error.message);
                }
            }
        }

        // Verify remaining tables
        console.log('\n🔍 Checking remaining tables...');
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `;

        console.log('\n📊 Current database tables:');
        tables.forEach(table => {
            const icon = table.table_name.startsWith('admin_') ? '❌' : '✅';
            console.log(`   ${icon} ${table.table_name}`);
        });

        console.log('\n🎉 Admin tables cleanup completed!');
        console.log('✨ Admin now uses the same tables as students - unified data model!');

    } catch (error) {
        console.error('❌ Error during admin tables cleanup:', error);
        throw error;
    }
}

// Run the cleanup
dropAdminTables()
    .then(() => {
        console.log('\n🚀 Database cleanup completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Failed to cleanup database:', error);
        process.exit(1);
    });