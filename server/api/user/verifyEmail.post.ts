import { and, eq, inArray } from 'drizzle-orm';
import { emailVerificationTokens, users } from '~/server/database/schema';
import { insertVerifyEmailTokenSchema } from '~/server/types';

export default defineEventHandler(async event => {
	const body = await readBody(event);

	const { token, user_id } = await insertVerifyEmailTokenSchema.parseAsync(body);

	const storedTokens = await useDb()
		.select()
		.from(emailVerificationTokens)
		.where(eq(emailVerificationTokens.user_id, user_id));

	if (storedTokens.length === 0) {
		throw new Error('Invalid token');
	}

	// Last is first in the array
	storedTokens.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

	if (storedTokens.length > 1) {
		console.log(`Multiple tokens found for the same user (${user_id}). Will delete all but the last created token.`);
		const tokensToDelete = storedTokens.slice(1).map(({ id }) => id);
		await useDb()
			.delete(emailVerificationTokens)
			.where(and(eq(emailVerificationTokens.user_id, user_id), inArray(emailVerificationTokens.id, tokensToDelete)))
			.execute();
	}

	const storedToken = storedTokens[0];

	if (storedToken.token !== token) {
		throw new Error('Invalid token');
	}

	await useDb().delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, storedToken.id)).execute();
	await useDb().update(users).set({ emailIsVerified: true }).where(eq(users.id, user_id)).execute();

	return { success: true };
});
