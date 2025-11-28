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
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core";
import { StudyResourceTypeEnum } from "../db/queries/resources";

export const studyResourceType = pgEnum(
  "study_resource_type",
  Object.values(StudyResourceTypeEnum) as [string, ...string[]]
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
  refreshToken: varchar().notNull(),
});

export const tags = pgTable("tags", {
  tagId: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  content: varchar({ length: 50 }).notNull(),
  color: varchar({ length: 7 }).notNull().default("#000000"),
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
  durationMinutes: integer().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const studyResources = pgTable("study_resources", {
  resourceId: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  title: varchar({ length: 255 }).notNull(),
  type: studyResourceType().notNull(),
  content: varchar({ length: 255 }),
});

export const studySessionsStudyResources = pgTable(
  "study_sessions_study_resources",
  {
    sessionId: uuid()
      .notNull()
      .references(() => studySessions.sessionId, { onDelete: "cascade" }),
    resourceId: uuid()
      .notNull()
      .references(() => studyResources.resourceId, { onDelete: "cascade" }),
    label: varchar({ length: 100 }),
  },
  (table) => [primaryKey({ columns: [table.sessionId, table.resourceId] })]
);

export const quizzes = pgTable("quizzes", {
  quizId: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  sessionId: uuid()
    .notNull()
    .references(() => studySessions.sessionId, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  title: varchar({ length: 255 }).notNull(),
  isMultipleChoice: boolean().default(false).notNull(),
  numberOfQuestions: integer().notNull(),
  quizContent: jsonb().notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  quizAttemptId: uuid().defaultRandom().primaryKey(),
  quizId: uuid()
    .notNull()
    .references(() => quizzes.quizId, { onDelete: "cascade" }),
  finishedAt: timestamp().defaultNow().notNull(),
  userAttemptContent: jsonb().notNull(),
  score: numeric({ precision: 5, scale: 2 }),
});

export const challenges = pgTable("challenges", {
  challengeId: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }).unique(),
  title: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  targetValue: integer().notNull(),
  targetCompleteDate: timestamp(),
  type: challengeType().notNull(),
});
