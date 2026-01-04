import {
  and,
  avg,
  between,
  count,
  countDistinct,
  eq,
  or,
  sql,
  sum,
} from "drizzle-orm";
import { db } from "../index";
import {
  quizAttempts,
  quizzes,
  studyResources,
  studySessions,
  tags,
  users,
  userSettings,
} from "../schema";

export interface UserRegister {
  username: string;
  password: string;
  email: string;
}
export interface UserLogin {
  email: string;
  password: string;
}

export async function getUserByUsername(username: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return result;
}
export async function getUserByEmail(email: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result;
}
export async function getUserById(id: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.userId, id))
    .limit(1);
  return result;
}
export async function getUserByCredentials(
  email: string,
  passwordHash: string
) {
  const [result] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.password, passwordHash)))
    .limit(1);
  return result;
}
export async function createUser(data: UserRegister) {
  const [result] = await db
    .insert(users)
    .values({ ...data })
    .returning();
  return result;
}

export async function getUserStats(userId: string) {
  const [sessionsStats] = await db
    .select({
      totalSessions: count(studySessions.sessionId),
      totalDuration: sql<number>`sum(${studySessions.durationMinutes})::integer`,
    })
    .from(studySessions)
    .where(eq(studySessions.userId, userId));

  const [quizzesStats] = await db
    .select({
      totalQuizzes: countDistinct(quizzes.quizId),
      totalQuizAttempts: count(quizAttempts.quizAttemptId),
      averageQuizScore: sql<number>`
      ROUND(
        AVG((${quizAttempts.score}::float / ${quizzes.maxScore}) * 100)::numeric,
        2
      )
    `,
    })
    .from(quizzes)
    .leftJoin(quizAttempts, eq(quizzes.quizId, quizAttempts.quizId))
    .where(eq(quizzes.userId, userId));

  const [resourcesStats] = await db
    .select({
      totalResources: count(studyResources.resourceId),
    })
    .from(studyResources)
    .where(eq(studyResources.userId, userId));

  return { sessionsStats, quizzesStats, resourcesStats };
}
export async function updateUserSettings(
  userId: string,
  data: { dailyStudyGoal?: number; weeklyQuizGoal?: number }
) {
  const [result] = await db
    .insert(userSettings)
    .values({
      userId,
      ...data,
    })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: data,
    })
    .returning();

  return result;
}
export async function getUserSettings(userId: string) {
  const [result] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);
  return result;
}
export async function getUseBarChartData(userId: string, from: Date, to: Date) {
  const result = await db
    .select({
      tag: tags.content,
      tagColor: tags.color,
      duration: studySessions.durationMinutes,
      startedAt: studySessions.startedAt,
    })
    .from(studySessions)
    .leftJoin(tags, eq(studySessions.tagId, tags.tagId))
    .where(
      and(
        eq(studySessions.userId, userId),
        between(studySessions.startedAt, from, to)
      )
    );
  return result;
}
export async function getUserProgressData(
  userId: string,
  from: Date,
  to: Date
) {
  const sessionsData = await db
    .select({
      duration: studySessions.durationMinutes,
      startedAt: studySessions.startedAt,
      title: studySessions.title,
      sessionId: studySessions.sessionId,
    })
    .from(studySessions)
    .leftJoin(tags, eq(studySessions.tagId, tags.tagId))
    .where(
      and(
        eq(studySessions.userId, userId),
        between(studySessions.startedAt, from, to)
      )
    );
  const quizAttemptsData = await db
    .select({
      score: quizAttempts.score,
      quizAttemptId: quizAttempts.quizAttemptId,
      title: quizzes.title,
      finishedAt: quizAttempts.finishedAt,
      quizId: quizzes.quizId,
    })
    .from(quizAttempts)
    .leftJoin(quizzes, eq(quizAttempts.quizId, quizzes.quizId))
    .where(
      and(
        between(quizAttempts.finishedAt, from, to),
        eq(quizzes.userId, userId)
      )
    );
  return { sessionsData, quizAttemptsData };
}

export default {
  getUserByUsername,
  getUserByEmail,
  getUserById,
  getUserByCredentials,
  createUser,
  getUserStats,
  updateUserSettings,
  getUserSettings,
  getUseBarChartData,
  getUserProgressData,
};
