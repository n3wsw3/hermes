import type { UserSelect } from './server/types';

declare module '#auth-utils' {
	interface User {
		id: UserSelect['id'];
	}
}
