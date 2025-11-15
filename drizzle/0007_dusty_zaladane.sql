CREATE TABLE "reviews" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reviews_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(255) NOT NULL,
	"userName" varchar(255) NOT NULL,
	"userEmail" varchar(255),
	"rating" integer NOT NULL,
	"reviewText" text NOT NULL,
	"isApproved" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now()
);
