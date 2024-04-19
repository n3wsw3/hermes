import type { UserSelect } from './server/database/schema';

declare module '#auth-utils' {
	interface User {
		id: UserSelect['id'];
	}
}
