import { eq } from 'drizzle-orm';
import { users } from '~/server/database/schema';
import { loginSchema } from '~/server/types';

export default defineEventHandler(async event => {
	const body = await readBody(event);

	const { email, password } = await loginSchema.parseAsync(body);

	const fechedUsers = await useDb().select().from(users).where(eq(users.email, email));

	if (fechedUsers.length === 0 && !(await verifyPassword('dummy', 'dummy'))) {
		throw new Error('Invalid email or password');
	}

	const user = fechedUsers[0];

	if (!(await verifyPassword(user.password, password))) {
		throw new Error('Invalid email or password');
	}

	await setUserSession(event, { user: { id: user.id } });

	return { success: true };
});
