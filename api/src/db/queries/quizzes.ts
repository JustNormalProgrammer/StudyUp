import { db } from "..";
import { quizzes, quizAttempts, tags } from "../schema";
import { and, between, desc, eq } from "drizzle-orm";
import { PaginationQuery } from "./sessions";

export interface quizAttemptCreate {
  quizId: string;
  userAttemptContent: any;
  score: string;
}


export async function getUserQuizzes(userId: string){
  const result = await db
    .select({
      quizId: quizzes.quizId,
      userId: quizzes.userId,
      title: quizzes.title,
      numberOfQuestions: quizzes.numberOfQuestions,
      isMultipleChoice: quizzes.isMultipleChoice,
      createdAt: quizzes.createdAt,
      tag:{
        tagId: tags.tagId,
        content: tags.content,
        color: tags.color,
      },
    })
    .from(quizzes)
    .innerJoin(tags, eq(quizzes.tagId, tags.tagId))
    .where(eq(quizzes.userId, userId));
  return result;
}

export async function getQuiz(quizId: string, userId: string) {
  const [quiz] = await db
    .select({
      quizId: quizzes.quizId,
      userId: quizzes.userId,
      title: quizzes.title,
      isMultipleChoice: quizzes.isMultipleChoice,
      createdAt: quizzes.createdAt,
      numberOfQuestions: quizzes.numberOfQuestions,
      tag:{
        tagId: tags.tagId,
        content: tags.content,
        color: tags.color,
      },
      quizContent: quizzes.quizContent,
    })
    .from(quizzes)
    .innerJoin(tags, eq(quizzes.tagId, tags.tagId))
    .where(and(eq(quizzes.quizId, quizId), eq(quizzes.userId, userId)))
    .limit(1);
  return quiz;
}

export async function getQuizAttempts(quizId: string, userId: string) {
  const result = await db
    .select({
      quizAttemptId: quizAttempts.quizAttemptId,
      quizId: quizAttempts.quizId,
      finishedAt: quizAttempts.finishedAt,
      score: quizAttempts.score,
    })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.quizId))
    .where(and(eq(quizAttempts.quizId, quizId), eq(quizzes.userId, userId)));
  return result;
}

export async function getUserAttempts(data: PaginationQuery) { 
  const { userId, from, to, page = 1, itemsOnPage = 10 } = data;
  const result = await db
    .select({
      quizAttemptId: quizAttempts.quizAttemptId,
      quizId: quizAttempts.quizId,
      quizTitle: quizzes.title,
      score: quizAttempts.score,
      tag:{
        tagId: tags.tagId,
        content: tags.content,
        color: tags.color,
      },
    })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.quizId))
    .innerJoin(tags, eq(quizzes.tagId, tags.tagId))
    .where(and(eq(quizzes.userId, userId), between(quizAttempts.finishedAt, from, to)))
    .orderBy(desc(quizAttempts.finishedAt))
    .offset((page - 1) * itemsOnPage)
    .limit(itemsOnPage);
  return result;
}
export async function getQuizAttempt(quizAttemptId: string, userId: string) {
  const [quizAttempt] = await db
    .select({
      quizAttemptId: quizAttempts.quizAttemptId,
      userId: quizzes.userId,
      quizId: quizAttempts.quizId,
      finishedAt: quizAttempts.finishedAt,
      userAttemptContent: quizAttempts.userAttemptContent,
      score: quizAttempts.score,
    })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.quizId))
    .where(and(eq(quizAttempts.quizAttemptId, quizAttemptId), eq(quizzes.userId, userId)))
    .limit(1);
  return quizAttempt;
}
export async function createQuizAttempt(data: quizAttemptCreate) {
  const [quizAttempt] = await db.insert(quizAttempts).values(data).returning();
  return quizAttempt;
}
export async function deleteQuiz(quizId: string) {
  await db.delete(quizzes).where(eq(quizzes.quizId, quizId));
  return;
}
export async function deleteQuizAttempt(quizAttemptId: string) {
  await db.delete(quizAttempts).where(eq(quizAttempts.quizAttemptId, quizAttemptId))
  return;
}

export async function getQuizIds(quizId: string){
  const [quiz] = await db
    .select({
      quizId: quizzes.quizId,
      userId: quizzes.userId,
    })
    .from(quizzes)
    .where(eq(quizzes.quizId, quizId))
    .limit(1);
  return quiz;
}
export default {
  getUserQuizzes,
  getQuiz,
  getQuizAttempts,
  getQuizAttempt,
  createQuizAttempt,
  deleteQuiz,
  deleteQuizAttempt,
  getQuizIds,
  getUserAttempts,
}