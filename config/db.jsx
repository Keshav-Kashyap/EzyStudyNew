import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
}

// Configure Neon connection with optimized settings for production
const sql = neon(process.env.DATABASE_URL, {
    fetchConnectionCache: true,
    fetchOptions: {
        // Increase timeout to 60 seconds for large queries
        timeout: 60000,
    },
});

export const db = drizzle({ client: sql });
