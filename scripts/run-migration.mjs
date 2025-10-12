// Run this script using: npm run migrate-semesters
console.log('🔄 Starting semester category migration...');

// Add a simple API route to handle the migration
const response = await fetch('http://localhost:3000/api/migrate-semesters', {
    method: 'POST'
});

const result = await response.json();
console.log('Migration result:', result);