import { pgTable, text, timestamp, uuid, uniqueIndex, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['unverified', 'user', 'admin']);

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		name: text('name').notNull(),
		email: text('email').notNull().unique(),
		emailIsVerified: boolean('email_is_verified').notNull().default(false),
		password: text('password').notNull(),
		role: roleEnum('role').notNull().default('unverified'),
		created_at: timestamp('created_at').notNull().defaultNow(),
		updated_at: timestamp('updated_at').notNull().defaultNow()
	},
	users => ({
		idIndex: uniqueIndex('id_idx').on(users.id),
		emailIndex: uniqueIndex('email_idx').on(users.email)
	})
);

// A user should only have one email verification token at a time
export const emailVerificationTokens = pgTable(
	'email_verification_tokens',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		user_id: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		token: text('token').notNull(),
		created_at: timestamp('created_at').notNull().defaultNow(),
		updated_at: timestamp('updated_at').notNull().defaultNow()
	},
	emailVerificationTokens => ({
		userIndex: uniqueIndex('user_idx').on(emailVerificationTokens.user_id),
		tokenIndex: uniqueIndex('token_idx').on(emailVerificationTokens.token)
	})
);
