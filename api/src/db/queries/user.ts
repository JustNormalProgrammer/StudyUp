import {
  and,
  avg,
  between,
  count,
  countDistinct,
  eq,
  gte,
  lte,
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
  verificationTokens,
} from "../schema";
import { getWeekRange } from "../../utils/weekRange";

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
  passwordHash: string,
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
  data: { dailyStudyGoal: number; weeklyQuizGoal: number },
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
export async function upsertVerificationToken(userId: string, token: string) {
  await db
    .insert(verificationTokens)
    .values({ userId, token })
    .onConflictDoUpdate({
      target: verificationTokens.userId,
      set: { token },
    });
}
export async function removeVerificationToken(userId: string) {
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.userId, userId));
}
export async function getVerificationToken(userId: string) {
  const [result] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.userId, userId))
    .limit(1);
  return result;
}
export async function verifyUser(userId: string) {
  const [result] = await db
    .update(users)
    .set({ isVerified: true })
    .where(eq(users.userId, userId))
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
export async function getUserBarChartData(
  userId: string,
  from: Date,
  to: Date,
) {
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
        between(studySessions.startedAt, from, to),
      ),
    );
  return result;
}
export async function getUserProgressData(userId: string) {
  const startOfTodayUTC = new Date();
  startOfTodayUTC.setUTCHours(0, 0, 0, 0);
  const endOfTodayUTC = new Date();
  endOfTodayUTC.setUTCHours(23, 59, 59, 999);
  const { from, to } = getWeekRange(startOfTodayUTC);
  const [{ progress: todayProgress }] = await db
    .select({
      progress: sql<number>`coalesce(sum(${studySessions.durationMinutes})::integer, 0)`,
    })
    .from(studySessions)
    .where(
      and(
        eq(studySessions.userId, userId),
        gte(studySessions.startedAt, startOfTodayUTC),
        lte(studySessions.startedAt, endOfTodayUTC),
      ),
    );
  const [{ progress: weeklySessionsProgress }] = await db
    .select({
      progress: sql<number>`coalesce(sum(${studySessions.durationMinutes})::integer, 0)`,
    })
    .from(studySessions)
    .where(
      and(
        eq(studySessions.userId, userId),
        gte(studySessions.startedAt, from),
        lte(studySessions.startedAt, to),
      ),
    );
  const [{ progress: weeklyQuizProgress }] = await db
    .select({
      progress: sql<number>`count(${quizAttempts.quizAttemptId})::integer`,
    })
    .from(quizAttempts)
    .leftJoin(quizzes, eq(quizAttempts.quizId, quizzes.quizId))
    .where(
      and(
        eq(quizzes.userId, userId),
        gte(quizAttempts.finishedAt, from),
        lte(quizAttempts.finishedAt, to),
      ),
    );
  return { todayProgress, weeklySessionsProgress, weeklyQuizProgress };
}

export default {
  getUserByUsername,
  getUserByEmail,
  getUserById,
  getUserByCredentials,
  createUser,
  getUserStats,
  updateUserSettings,
  getVerificationToken,
  upsertVerificationToken,
  removeVerificationToken,
  verifyUser,
  getUserSettings,
  getUserBarChartData,
  getUserProgressData,
};
