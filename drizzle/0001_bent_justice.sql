CREATE TABLE "admin_courses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_courses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"duration" integer NOT NULL,
	"totalSemesters" integer,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "admin_courses_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "admin_materials" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_materials_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"courseId" integer,
	"semesterId" integer,
	"subjectId" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"materialType" varchar(50) NOT NULL,
	"fileUrl" varchar(500),
	"fileName" varchar(255),
	"fileSize" integer,
	"fileType" varchar(50),
	"downloadCount" integer DEFAULT 0,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_semesters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_semesters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"courseId" integer,
	"name" varchar(100) NOT NULL,
	"semesterNumber" integer NOT NULL,
	"description" text,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_subjects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_subjects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"courseId" integer,
	"semesterId" integer,
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"credits" integer NOT NULL,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "userId" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(50) DEFAULT 'student';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isActive" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "admin_materials" ADD CONSTRAINT "admin_materials_courseId_admin_courses_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."admin_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_materials" ADD CONSTRAINT "admin_materials_semesterId_admin_semesters_id_fk" FOREIGN KEY ("semesterId") REFERENCES "public"."admin_semesters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_materials" ADD CONSTRAINT "admin_materials_subjectId_admin_subjects_id_fk" FOREIGN KEY ("subjectId") REFERENCES "public"."admin_subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_semesters" ADD CONSTRAINT "admin_semesters_courseId_admin_courses_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."admin_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_subjects" ADD CONSTRAINT "admin_subjects_courseId_admin_courses_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."admin_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_subjects" ADD CONSTRAINT "admin_subjects_semesterId_admin_semesters_id_fk" FOREIGN KEY ("semesterId") REFERENCES "public"."admin_semesters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_userId_unique" UNIQUE("userId");