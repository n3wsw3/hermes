import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './server/database/schema.ts',
	out: './server/database/migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: 'postgres://piloten:piloten@localhost:5432/pr-piloten'
	}
});
