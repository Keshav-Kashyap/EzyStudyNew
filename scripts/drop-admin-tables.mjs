import { db } from '../config/db.jsx';

async function dropAdminTables() {
    try {
        console.log('🗑️  Starting admin tables cleanup...');

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
                await db.execute(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`);
                console.log(`✅ Successfully dropped: ${tableName}`);
            } catch (error) {
                console.warn(`⚠️  Warning: Could not drop ${tableName}:`, error.message);
            }
        }

        console.log('\n🎉 Admin tables cleanup completed!');
        console.log('📊 Remaining tables are the main tables used by both admin and students:');
        console.log('   - courses (main courses table)');
        console.log('   - semesters (main semesters table)');
        console.log('   - subjects (main subjects table)');
        console.log('   - study_materials (main materials table)');
        console.log('   - users (main users table)');
        console.log('   - notifications (main notifications table)');

        console.log('\n✨ Admin now manages the same tables as students - no separate admin tables!');

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