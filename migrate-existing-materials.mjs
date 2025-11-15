import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function migrateExistingMaterials() {
    try {
        console.log('Starting migration of existing study materials...');

        // Note: Since subjectId column was dropped, we cannot migrate existing mappings
        // Admin will need to re-assign materials to subjects through the UI

        console.log('\n✅ Migration setup complete!');
        console.log('\nIMPORTANT: The subjectId column has been removed from study_materials.');
        console.log('Materials are now independent and can be assigned to multiple subjects.');
        console.log('Please use the admin panel to assign existing materials to subjects.\n');

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateExistingMaterials();
