import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Configure Neon connection with increased timeout
const sql = neon(process.env.DATABASE_URL, {
    fetchConnectionCache: true,
    fetchOptions: {
        // Increase timeout to 30 seconds
        timeout: 30000,
    },
});

export const db = drizzle({ client: sql });
