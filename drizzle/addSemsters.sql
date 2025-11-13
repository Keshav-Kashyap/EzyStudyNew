ALTER TABLE "courses"
ADD COLUMN "semesters" integer GENERATED ALWAYS AS ("duration" * 2) STORED;
