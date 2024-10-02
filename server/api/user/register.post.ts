import { emailVerificationTokens, users } from '~/server/database/schema';
import { insertUserSchema, registerSchema } from '~/server/types';
import { sendVerifyEmail } from '~/server/utils/email';
import { hashPassword } from '~/server/utils/password';

export default defineEventHandler(async event => {
	const body = await readBody(event);

	const user = await registerSchema.parseAsync(body);

	// Hash the password before storing it in the database
	user.password = await hashPassword(user.password);

	const inserted = (
		await useDb()
			.insert(users)
			.values({ role: 'user', ...user })
			.returning()
	)[0];

	// Create a token for email verification and send it to the user
	const token = Math.random().toString(36).substring(2, 8);

	await useDb().insert(emailVerificationTokens).values({ user_id: inserted.id, token }).execute();
	await sendVerifyEmail(user.email, token);

	await setUserSession(event, { user: { id: inserted.id } });

	setResponseStatus(event, 201);

	return { success: true };
});
