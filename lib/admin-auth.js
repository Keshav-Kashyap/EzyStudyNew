import { db } from "../config/db.jsx";
import { usersTable } from "../config/schema.jsx";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function checkAdminAccess() {
    try {
        const user = await currentUser();

        if (!user) {
            return { isAuthenticated: false, isAdmin: false, error: "Not logged in" };
        }

        // Check if user exists in database with admin role
        const dbUser = await db.select()
            .from(usersTable)
            .where(eq(usersTable.userId, user.id))
            .limit(1);

        if (dbUser.length === 0) {
            // User doesn't exist in database, create them as student
            const newUser = await db.insert(usersTable).values({
                userId: user.id,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
                email: user.emailAddresses?.[0]?.emailAddress || '',
                role: 'student',
                isActive: true
            }).returning();

            return {
                isAuthenticated: true,
                isAdmin: false,
                user: newUser[0],
                message: "New user created as student"
            };
        }

        const userRecord = dbUser[0];

        return {
            isAuthenticated: true,
            isAdmin: userRecord.role === 'admin' && userRecord.isActive,
            user: userRecord
        };

    } catch (error) {
        console.error('Admin check error:', error);
        return { isAuthenticated: false, isAdmin: false, error: error.message };
    }
}