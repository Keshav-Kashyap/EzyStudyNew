// Simple seed script using fetch
async function seedData() {
    try {
        console.log('🌱 Starting database seeding...');

        // Use fetch to call seed API
        const response = await fetch('http://localhost:3000/api/seed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Seeding successful:', result);

        // Now check if data was inserted
        const checkResponse = await fetch('http://localhost:3000/api/check-db');
        const checkResult = await checkResponse.json();
        console.log('🔍 Database check:', checkResult);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

// Run the seed function
seedData();