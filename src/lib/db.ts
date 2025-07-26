import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Create Neon SQL client - specific to Neon
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle instance with neon-http adapter
export const db = drizzle({ client: sql });