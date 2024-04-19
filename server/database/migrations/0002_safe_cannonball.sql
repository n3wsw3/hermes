DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('unverified', 'user', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'unverified' NOT NULL;