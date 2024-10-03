import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../database/schema';

export const useDb = () => {
	return drizzle(hubDatabase(), { schema });
};
