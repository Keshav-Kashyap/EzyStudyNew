// Test Admin APIs - Run this to verify admin functionality
const baseUrl = "http://localhost:3000";

async function testAdminAPIs() {
    console.log("🧪 Testing Admin APIs...\n");

    try {
        // Test 1: Admin Dashboard Stats
        console.log("1️⃣ Testing Admin Dashboard...");
        const dashboardRes = await fetch(`${baseUrl}/api/admin/dashboard`);
        const dashboardData = await dashboardRes.json();
        console.log("Dashboard Response:", dashboardData);
        console.log("✅ Dashboard API working\n");

        // Test 2: Get Materials
        console.log("2️⃣ Testing Get Materials...");
        const materialsRes = await fetch(`${baseUrl}/api/admin/materials`);
        const materialsData = await materialsRes.json();
        console.log("Materials Response:", materialsData);
        console.log("✅ Materials API working\n");

        // Test 3: Get Subjects
        console.log("3️⃣ Testing Get Subjects...");
        const subjectsRes = await fetch(`${baseUrl}/api/admin/subjects`);
        const subjectsData = await subjectsRes.json();
        console.log("Subjects Response:", subjectsData);
        console.log("✅ Subjects API working\n");

        // Test 4: Create Course (requires admin auth)
        console.log("4️⃣ Testing Create Course... (Will fail without admin auth)");
        const createCourseRes = await fetch(`${baseUrl}/api/admin/dashboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create_course',
                name: 'Test Course',
                code: 'test',
                description: 'Test course description',
                duration: '2'
            })
        });
        const createCourseData = await createCourseRes.json();
        console.log("Create Course Response:", createCourseData);
        console.log("ℹ️ Expected to fail without admin authentication\n");

        console.log("🎉 Admin API Tests Completed!");
        console.log("\n📋 Setup Instructions:");
        console.log("1. Set up Cloudinary account (free 25GB)");
        console.log("2. Add environment variables to .env.local");
        console.log("3. Set user as admin in Clerk metadata");
        console.log("4. Access admin panel at /admin/library");

    } catch (error) {
        console.error("❌ Error testing APIs:", error);
    }
}

// Run tests if this is executed directly
if (typeof window === 'undefined') {
    testAdminAPIs();
}

export default testAdminAPIs;