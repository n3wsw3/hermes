import { emailVerificationTokens, users } from '~/server/database/schema';
import { insertUserSchema } from '~/server/types';
import { sendVerifyEmail } from '~/server/utils/email';
import { hashPassword } from '~/server/utils/password';

const isDtekEmail = (email: string) =>
	email.endsWith('@student.chalmers.se') || email.endsWith('@chalmers.se') || email.endsWith('@dtek.se');

export default defineEventHandler(async event => {
	const body = await readBody(event);

	const user = await insertUserSchema.parseAsync(body);

	// Hash the password before storing it in the database
	user.password = await hashPassword(user.password);

	// If the user is from Dtek or chalmers, we can allow them
	// to post PR without being promoted to user by admin
	// Otherwise, they need to verify their email and then be
	// promoted to user by an admin
	const role = isDtekEmail(user.email) ? 'user' : 'unverified';

	const inserted = (
		await useDb()
			.insert(users)
			.values({ role, ...user })
			.returning()
	)[0];

	// Create a token for email verification and send it to the user
	const token = Math.random().toString(36).substring(2, 8);

	await useDb().insert(emailVerificationTokens).values({ user_id: inserted.id, token }).execute();
	await sendVerifyEmail(user.email, token);

	await setUserSession(event, { user: { id: inserted.id } });

	return { success: true };
});
