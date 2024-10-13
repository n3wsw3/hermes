import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js/driver';
import postgres from 'postgres';

let pg: postgres.Sql | null = null;
let db: PostgresJsDatabase | null = null;

export const useDb = () => {
	if (!db) {
		pg = postgres(useRuntimeConfig().db.connection_string, { max: 1 });
		db = drizzle(pg);
	}
	return db;
};
