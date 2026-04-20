-- Add Contact Submissions Table
CREATE TABLE IF NOT EXISTS "contact_submissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contact_submissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"source" varchar(100) DEFAULT 'join-us' NOT NULL,
	"status" varchar(50) DEFAULT 'new' NOT NULL,
	"createdAt" timestamp DEFAULT now()
);