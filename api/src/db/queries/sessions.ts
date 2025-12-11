import { and, eq, between, desc, sql } from "drizzle-orm";
import { db } from "../index";
import {
  studyResources,
  studySessions,
  studySessionsStudyResources,
} from "../schema";
import { tags } from "../schema";
import { getStudyResourcesBySessionId, StudyResourceTypeEnum } from "./resources";

export interface StudySessionCreate {
  userId: string;
  tagId: string;
  title: string;
  notes?: string;
  startedAt: Date;
  durationMinutes: number;
}
export type StudySessionUpdate = Partial<Omit<StudySessionCreate, "userId">>;

export interface StudySessionResource {
  sessionId: string;
  title: string;
  type: StudyResourceTypeEnum;
  content?: string;
}

export interface PaginationQuery {
  userId: string;
  from: Date;
  to: Date;
  start?: number;
  limit?: number;
}

export async function getSessions(data: Required<PaginationQuery>) {
  const { userId, from, to, start, limit } = data;
  const result = await db
    .select({
      sessionId: studySessions.sessionId,
      tagId: studySessions.tagId,
      title: studySessions.title,
      notes: studySessions.notes,
      startedAt: studySessions.startedAt,
      durationMinutes: studySessions.durationMinutes,
      tag: {
        tagId: tags.tagId,
        content: tags.content,
        color: tags.color,
      },
    })
    .from(studySessions)
    .leftJoin(tags, eq(studySessions.tagId, tags.tagId))
    .where(
      and(
        eq(studySessions.userId, userId),
        between(studySessions.startedAt, from, to)
      )
    )
    .orderBy(desc(studySessions.startedAt))
    .offset(start)
    .limit(limit);
  return result;
}
export async function getSessionById(sessionId: string, userId: string) {
  const [result] = await db
    .select({
      sessionId: studySessions.sessionId,
      userId: studySessions.userId,
      tagId: tags.tagId,
      title: studySessions.title,
      notes: studySessions.notes,
      startedAt: studySessions.startedAt,
      durationMinutes: studySessions.durationMinutes,
      tag: {
        tagId: tags.tagId,
        content: tags.content,
        color: tags.color,
      },
    })
    .from(studySessions)
    .leftJoin(tags, eq(studySessions.tagId, tags.tagId))
    .where(
      and(
        eq(studySessions.sessionId, sessionId),
        eq(studySessions.userId, userId)
      )
    )
    .groupBy(studySessions.sessionId, tags.tagId)
    .limit(1);
  return result;
}
export async function createStudySession(session: StudySessionCreate) {
  const [result] = await db.insert(studySessions).values(session).returning();
  return result;
}

export async function updateStudySession(
  sessionId: string,
  updateData: StudySessionUpdate
) {
  const [result] = await db
    .update(studySessions)
    .set(updateData)
    .where(eq(studySessions.sessionId, sessionId))
    .returning();
  return result;
}

export async function updateStudySessionResources(
  sessionId: string,
  resourceIds: string[]
) {
  const resourcesToAdd = resourceIds.map((resourceId) => ({
    sessionId,
    resourceId,
  }));
  await db
    .delete(studySessionsStudyResources)
    .where(eq(studySessionsStudyResources.sessionId, sessionId));
  await db.insert(studySessionsStudyResources).values(resourcesToAdd);
  return;
}

export async function deleteStudySession(sessionId: string) {
  await db
    .delete(studySessions)
    .where(eq(studySessions.sessionId, sessionId))
    .returning();
  return;
}

export default {
  getSessions,
  createStudySession,
  getSessionById,
  updateStudySession,
  updateStudySessionResources,
  deleteStudySession,
};
