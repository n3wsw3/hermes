CREATE TABLE `email_verification_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_is_verified` integer DEFAULT false NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'unverified' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_verification_tokens_id_unique` ON `email_verification_tokens` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_idx` ON `email_verification_tokens` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `token_idx` ON `email_verification_tokens` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `id_idx` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);