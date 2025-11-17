import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { studyResourceTypeEnum } from "../db/queries/sessions";

export const studyResourceType = pgEnum(
  "study_resource_type",
  Object.values(studyResourceTypeEnum) as [string, ...string[]]
);
export const challengeType = pgEnum("challenge_type", [
  "time",
  "nOfTasks",
  "task",
]);

export const users = pgTable("users", {
  userId: uuid().defaultRandom().primaryKey(),
  username: varchar({ length: 100 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 256 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  userId: uuid()
    .references(() => users.userId)
    .primaryKey(),
  refreshToken: varchar({ length: 256 }).notNull(),
});

export const tags = pgTable("tags", {
  tagId: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  content: varchar({ length: 50 }).notNull(),
});

export const studySessions = pgTable("study_sessions", {
  sessionId: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  tagId: uuid()
    .notNull()
    .references(() => tags.tagId, { onDelete: "cascade" }),
  title: varchar({ length: 255 }).notNull(),
  notes: text(),
  startedAt: timestamp().notNull(),
  durationMinutes: integer(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const studyResources = pgTable("study_resources", {
  resourceId: uuid().defaultRandom().primaryKey(),
  sessionId: uuid()
    .notNull()
    .references(() => studySessions.sessionId, { onDelete: "cascade" }),
  title: varchar({ length: 255 }).notNull(),
  type: studyResourceType().notNull(),
  content: varchar({ length: 255 }),
});

export const quizzes = pgTable("quizzes", {
  quizId: uuid().defaultRandom().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  tagId: uuid()
    .notNull()
    .references(() => tags.tagId, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  questionId: uuid().defaultRandom().primaryKey(),
  quizId: uuid()
    .notNull()
    .references(() => quizzes.quizId, { onDelete: "cascade" }),
  content: text().notNull(),
});

export const questionChoices = pgTable("question_choices", {
  questionChoiceId: uuid().defaultRandom().primaryKey(),
  questionId: uuid()
    .notNull()
    .references(() => questions.questionId, { onDelete: "cascade" }),
  content: text().notNull(),
  isCorrect: boolean().default(false).notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  quizAttemptId: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  quizId: uuid()
    .notNull()
    .references(() => quizzes.quizId, { onDelete: "cascade" }),
  startedAt: timestamp().defaultNow().notNull(),
  finishedAt: timestamp(),
  score: numeric({ precision: 5, scale: 2 }),
});

export const userAnswers = pgTable("user_answers", {
  userAnswerId: uuid().defaultRandom().primaryKey(),
  quizAttemptId: uuid()
    .notNull()
    .references(() => quizAttempts.quizAttemptId, { onDelete: "cascade" }),
  questionId: uuid()
    .notNull()
    .references(() => questions.questionId, { onDelete: "cascade" }),
  answerId: uuid().references(() => questionChoices.questionChoiceId, {
    onDelete: "cascade",
  }),
  isCorrect: boolean(),
});

export const challenges = pgTable("challenges", {
  challengeId: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  title: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  targetValue: integer().notNull(),
  targetCompleteDate: timestamp(),
  type: challengeType().notNull(),
});
