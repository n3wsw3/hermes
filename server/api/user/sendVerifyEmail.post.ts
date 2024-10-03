import { desc, eq } from 'drizzle-orm';
import { emailVerificationTokens, users } from '~/server/database/schema';

export default defineEventHandler(async event => {
	const {
		user: { id: userId }
	} = await requireUserSession(event);

	// Fetch user from the database
	const user = (await useDb().select().from(users).where(eq(users.id, userId))).at(0);

	if (user === undefined) {
		throw createError({ message: 'The session belongs to a user that does not exist', status: 400 });
	}

	if (user.emailIsVerified) {
		throw createError({ message: 'The email is already verified', status: 400 });
	}

	const newestVerificationToken = (
		await useDb()
			.select({ created_at: emailVerificationTokens.created_at })
			.from(emailVerificationTokens)
			.where(eq(emailVerificationTokens.user_id, userId))
			.orderBy(desc(emailVerificationTokens.created_at))
			.limit(1)
			.execute()
	).at(0);

	if (newestVerificationToken !== undefined && +newestVerificationToken.created_at > Date.now() - 1000 * 60 * 10) {
		throw createError({
			message: 'A verification email was already sent less than 10 minutes ago',
			status: 400
		});
	}

	// Delete all old tokens
	await useDb().delete(emailVerificationTokens).where(eq(emailVerificationTokens.user_id, userId)).execute();

	// Create a token for email verification and send it to the user
	const token = Math.random().toString(36).substring(2, 8);

	await useDb().insert(emailVerificationTokens).values({ user_id: user.id, token }).execute();
	await sendVerifyEmail(user.email, token);

	return { success: true };
});
