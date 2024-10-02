import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { emailVerificationTokens, users } from '../database/schema';
import { z } from 'zod';

export const insertUserSchema = createInsertSchema(users).omit({
	id: true,
	created_at: true,
	updated_at: true,
	role: true,
	emailIsVerified: true
});

export const selectUserSchema = createSelectSchema(users);
export type UserSelect = z.infer<typeof selectUserSchema>;

export const insertVerifyEmailTokenSchema = createInsertSchema(emailVerificationTokens).omit({
	id: true,
	created_at: true,
	updated_at: true
});

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string()
});

export const registerSchema = z
	.object({
		email: z.string().email().endsWith('@chalmers.se', 'Email must end with @chalmers.se'),
		name: z.string().min(2),
		password: z.string().min(8),
		confirmPassword: z.string().min(8)
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});
