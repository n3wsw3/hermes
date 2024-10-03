import { and, eq } from 'drizzle-orm';
import { emailVerificationTokens, users } from '~/server/database/schema';
import { verifyEmailSchema } from '~/server/types';

export default defineEventHandler(async event => {
	const body = await readBody(event);

	const { user: { id: user_id } } = await requireUserSession(event);

	const { token } = await verifyEmailSchema.parseAsync(body);

	const storedToken = (await useDb().select()
		.from(emailVerificationTokens)
		.where(and(eq(emailVerificationTokens.user_id, user_id), eq(emailVerificationTokens.token, token)))
	).at(0);

	if (storedToken === undefined) {
		throw createError({ message: 'Invalid token', status: 400 });
	}

	// Delete all old tokens
	await useDb().delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, storedToken.id));
	await useDb().update(users).set({ emailIsVerified: true }).where(eq(users.id, user_id));

	return { success: true };
});
