import { pgEnum, uuid, boolean, timestamp, pgTable, text, uniqueIndex, integer, bigint } from 'drizzle-orm/pg-core';

const timestamps = {
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date())
};

export const roleEnum = pgEnum('role', ['unverified', 'user', 'admin']);

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().defaultRandom().unique(),
		name: text('name').notNull(),
		email: text('email').notNull().unique(),
		emailIsVerified: boolean('email_is_verified').notNull().default(false),
		password: text('password').notNull(),
		role: roleEnum('role').notNull().default('unverified'),
		...timestamps
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
		id: uuid('id').primaryKey().defaultRandom().unique(),
		user_id: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		token: text('token').notNull(),
		...timestamps
	},
	emailVerificationTokens => ({
		userIndex: uniqueIndex('user_idx').on(emailVerificationTokens.user_id),
		tokenIndex: uniqueIndex('token_idx').on(emailVerificationTokens.token)
	})
);

export const wallets = pgTable(
	'wallets',
	{
		id: uuid('id').primaryKey().defaultRandom().unique(),
		user_id: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		balance: bigint('balance', { mode: 'number' }).notNull().default(0),
		...timestamps
	},
	wallet => ({
		userIndex: uniqueIndex('user_idx').on(wallet.user_id)
	})
);

export const transactions = pgTable(
	'transactions',
	{
		id: uuid('id').primaryKey().defaultRandom().unique(),
		from: uuid('from').references(() => users.id, { onDelete: 'set null' }),
		to: uuid('to').references(() => users.id, { onDelete: 'set null' }),
		amount: bigint('amount', { mode: 'number' }).notNull(),
		description: text('description').notNull(),
		...timestamps
	},
	transaction => ({
		idIndex: uniqueIndex('id_idx').on(transaction.id),
		fromIndex: uniqueIndex('from_idx').on(transaction.from),
		toIndex: uniqueIndex('to_idx').on(transaction.to)
	})
);
