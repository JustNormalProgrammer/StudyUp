CREATE TYPE "public"."challenge_type" AS ENUM('time', 'nOfTasks', 'task');--> statement-breakpoint
CREATE TYPE "public"."study_resource_type" AS ENUM('video', 'book', 'website', 'other');--> statement-breakpoint
CREATE TABLE "challenges" (
	"challenge_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"target_value" integer NOT NULL,
	"target_complete_date" timestamp,
	"type" "challenge_type" NOT NULL,
	CONSTRAINT "challenges_userId_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"quiz_attempt_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"finished_at" timestamp DEFAULT now() NOT NULL,
	"user_attempt_content" jsonb NOT NULL,
	"score" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"quiz_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"title" varchar(255) NOT NULL,
	"is_multiple_choice" boolean DEFAULT false NOT NULL,
	"number_of_questions" integer NOT NULL,
	"max_score" integer NOT NULL,
	"quiz_content" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"refresh_token" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_resources" (
	"resource_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" "study_resource_type" NOT NULL,
	"desc" varchar(255),
	"url" varchar(255),
	CONSTRAINT "study_resources_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"notes" text,
	"started_at" timestamp NOT NULL,
	"duration_minutes" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_sessions_study_resources" (
	"session_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"label" varchar(100),
	CONSTRAINT "study_sessions_study_resources_session_id_resource_id_pk" PRIMARY KEY("session_id","resource_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"tag_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"content" varchar(50) NOT NULL,
	"color" varchar(7) DEFAULT '#000000' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"daily_study_goal" integer DEFAULT 60 NOT NULL,
	"weekly_quiz_goal" integer DEFAULT 3 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("quiz_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_session_id_study_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."study_sessions"("session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_resources" ADD CONSTRAINT "study_resources_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_tag_id_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("tag_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions_study_resources" ADD CONSTRAINT "study_sessions_study_resources_session_id_study_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."study_sessions"("session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions_study_resources" ADD CONSTRAINT "study_sessions_study_resources_resource_id_study_resources_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."study_resources"("resource_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;