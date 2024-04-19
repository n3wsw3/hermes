import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { useDb } from '../utils/db';

export default defineNitroPlugin(async () => {
	const config = useRuntimeConfig();

	migrate(useDb(), { migrationsFolder: config.db.migrations })
		.then(() => console.log('Migrations complete'))
		.catch(err => console.error(err));
});
