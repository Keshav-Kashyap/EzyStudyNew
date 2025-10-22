CREATE TABLE "notifications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notifications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"courseCode" varchar(50),
	"courseName" varchar(255),
	"semesterName" varchar(100),
	"subjectName" varchar(255),
	"materialTitle" varchar(255),
	"actionUrl" varchar(500),
	"isRead" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "study_materials" ADD COLUMN "likes" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "study_materials" ADD COLUMN "imageUrl" text;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;