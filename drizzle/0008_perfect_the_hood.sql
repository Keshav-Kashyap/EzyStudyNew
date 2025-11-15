CREATE TABLE "material_subject_mapping" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "material_subject_mapping_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"materialId" integer NOT NULL,
	"subjectId" integer NOT NULL,
	"addedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "study_materials" DROP CONSTRAINT "study_materials_subjectId_subjects_id_fk";
--> statement-breakpoint
ALTER TABLE "material_subject_mapping" ADD CONSTRAINT "material_subject_mapping_materialId_study_materials_id_fk" FOREIGN KEY ("materialId") REFERENCES "public"."study_materials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_subject_mapping" ADD CONSTRAINT "material_subject_mapping_subjectId_subjects_id_fk" FOREIGN KEY ("subjectId") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_materials" DROP COLUMN "subjectId";