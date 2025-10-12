import { db } from '../config/db.jsx';
import { usersTable } from '../config/schema.jsx';

async function createSampleAdmin() {
  try {
    console.log('🚀 Creating sample admin user...')

    // Create a sample admin user
    const adminUser = await db.insert(usersTable).values({
      userId: 'sample-admin-123', // You can replace this with your Clerk user ID
      name: 'Admin User',
      email: 'admin@example.com', // Replace with your email
      role: 'admin',
      isActive: true,
      credits: 100
    }).returning();

    console.log('Sample admin user created:', adminUser[0]);
    console.log('\n📋 Admin user details:');
    console.log('- Email:', adminUser[0].email);
    console.log('- Role:', adminUser[0].role);
    console.log('- Active:', adminUser[0].isActive);

    console.log('\n🎯 To make yourself admin:');
    console.log('1. Login to your app');
    console.log('2. Check your Clerk user ID');
    console.log('3. Update the userId in this script');
    console.log('4. Or use the make-admin API');

  } catch (error) {
    console.error(' Error creating admin user:', error)
  }
}

createSampleAdmin()