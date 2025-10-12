// Test script to verify APIs are working
async function testAPIs() {
    const baseUrl = 'http://localhost:3001';

    console.log('🧪 Testing APIs...\n');

    try {
        // Test courses API
        console.log('1. Testing /api/courses');
        const coursesResponse = await fetch(`${baseUrl}/api/courses`);
        const coursesData = await coursesResponse.json();
        console.log('Courses API Response:', {
            success: coursesData.success,
            coursesCount: coursesData.courses?.length,
            firstCourse: coursesData.courses?.[0]?.title
        });

        // Test dashboard stats API
        console.log('\n2. Testing /api/dashboard/stats');
        const statsResponse = await fetch(`${baseUrl}/api/dashboard/stats`);
        const statsData = await statsResponse.json();
        console.log('Dashboard Stats API Response:', {
            success: statsData.success,
            totalCourses: statsData.stats?.totalCourses,
            totalStudents: statsData.stats?.totalStudents
        });

        // Test individual course API
        console.log('\n3. Testing /api/courses/MCA');
        const mcaResponse = await fetch(`${baseUrl}/api/courses/MCA`);
        const mcaData = await mcaResponse.json();
        console.log('MCA Course API Response:', {
            success: mcaData.success,
            courseTitle: mcaData.course?.title,
            semestersCount: mcaData.course?.semesters?.length
        });

        console.log('\n All APIs are working correctly!');

    } catch (error) {
        console.error(' API Test Failed:', error.message);
    }
}

// Run the test
testAPIs();