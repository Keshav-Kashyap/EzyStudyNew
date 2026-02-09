import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
}

// Configure Neon connection with optimized settings and better error handling
const sql = neon(process.env.DATABASE_URL, {
    fetchConnectionCache: true,
    fetchOptions: {
        // Increase timeout to 90 seconds for better reliability
        timeout: 90000,
    },
});

export const db = drizzle({ client: sql });

// Helper function to retry database operations
export async function withRetry(operation, maxRetries = 3, delay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            console.error(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error.message);

            // Don't retry on certain errors
            if (error.message?.includes('syntax error') ||
                error.message?.includes('column') ||
                error.message?.includes('table')) {
                throw error;
            }

            if (attempt < maxRetries) {
                // Exponential backoff
                const waitTime = delay * Math.pow(2, attempt - 1);
                console.log(`Retrying in ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }

    throw lastError;
}
