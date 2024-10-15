import { consola } from 'consola';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { useDb } from '../utils/db';

export default defineNitroPlugin(async nuxtApp => {
	const config = useRuntimeConfig();

	await migrate(useDb(), { migrationsFolder: config.db.migrations })
		.then(() => consola.success('Migrations Complete'))
		.catch(err => consola.error('Migrations Failed', err));
});
