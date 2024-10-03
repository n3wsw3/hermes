import { integer } from 'drizzle-orm/sqlite-core';
import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import { v4 as uuidv4 } from 'uuid';

export const users = sqliteTable(
	'users',
	{
		id: text('id').primaryKey().unique().$defaultFn(uuidv4),
		name: text('name').notNull(),
		email: text('email').notNull().unique(),
		emailIsVerified: integer('email_is_verified', { mode: 'boolean' }).notNull().default(false),
		password: text('password').notNull(),
		role: text('role', { enum: ['unverified', 'user', 'admin'] })
			.notNull()
			.default('unverified'),
		created_at: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
		updated_at: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	users => ({
		idIndex: uniqueIndex('id_idx').on(users.id),
		emailIndex: uniqueIndex('email_idx').on(users.email)
	})
);

// A user should only have one email verification token at a time
export const emailVerificationTokens = sqliteTable(
	'email_verification_tokens',
	{
		id: text('id').primaryKey().unique().$defaultFn(uuidv4),
		user_id: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		token: text('token').notNull(),
		created_at: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
		updated_at: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	emailVerificationTokens => ({
		userIndex: uniqueIndex('user_idx').on(emailVerificationTokens.user_id),
		tokenIndex: uniqueIndex('token_idx').on(emailVerificationTokens.token)
	})
);
