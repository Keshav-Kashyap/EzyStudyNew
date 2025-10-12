import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function updateUsersTable() {
  try {
    console.log('🚀 Updating users table with admin system...')

    // Add new columns to existing users table
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'student',
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true
    `;
    console.log('Users table updated with role and admin fields')

    // Create index for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
    `;
    console.log('Indexes created')

    console.log(' Users table update completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('1. Users can now have role: "admin" or "student"')
    console.log('2. Admin access will be based on database role')
    console.log('3. You can manually set role="admin" for admin users')

  } catch (error) {
    console.error(' Migration failed:', error)
  }
}

updateUsersTable()