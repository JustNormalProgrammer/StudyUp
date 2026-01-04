import { and, eq, desc, sql, ilike, gte, lte, sum } from "drizzle-orm";
import { db } from "../index";
import {
  studySessions,
  studySessionsStudyResources,
} from "../schema";
import { tags } from "../schema";
import {
  StudyResourceTypeEnum,
} from "./resources";
import { withPagination } from "../withPagination";

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
  start?: number;
  limit?: number;
}

export interface TimeRangeQuery {
  from?: Date;
  to?: Date;
}
export interface FilterQuery {
  tagId?: string;
  q?: string;
}

export async function getSessions(
  userId: string,
  paginationQuery: PaginationQuery & FilterQuery & TimeRangeQuery
) {
  const { from, to, start, limit, tagId, q } = paginationQuery;
  const query = db
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
        from ? gte(studySessions.startedAt, from) : undefined,
        to ? lte(studySessions.startedAt, to) : undefined,
        tagId ? eq(studySessions.tagId, tagId) : undefined,
        q ? ilike(studySessions.title, `%${q}%`) : undefined
      )
    )
    .orderBy(desc(studySessions.startedAt), desc(studySessions.sessionId))
    .$dynamic();
  const result = await withPagination(query, start, limit);
  return result;
}

export async function getSessionsDurationByDay(
  userId: string,
  paginationQuery: PaginationQuery & FilterQuery & TimeRangeQuery
) {
  const { from, to, start, limit, tagId, q } = paginationQuery;
  const result = await db
    .select({
      sum: sum(studySessions.durationMinutes),
      day: sql<number>`extract(dow from ${studySessions.startedAt})`,
      color: tags.color,
    })
    .from(studySessions)
    .leftJoin(tags, eq(studySessions.tagId, tags.tagId))
    .where(
      and(
        eq(studySessions.userId, userId),
        from ? gte(studySessions.startedAt, from) : undefined,
        to ? lte(studySessions.startedAt, to) : undefined,
        tagId ? eq(studySessions.tagId, tagId) : undefined,
        q ? ilike(studySessions.title, `%${q}%`) : undefined
      )
    )
    .groupBy(
      sql<number>`extract(dow from ${studySessions.startedAt})`,
      tags.color
    )
  return result;
}

export async function getSessionById(sessionId: string, userId: string) {
  const [result] = await db
    .select({
      sessionId: studySessions.sessionId,
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
  resources: { resourceId: string; label?: string }[]
) {
  const resourcesToAdd = resources.map(({ resourceId, label }) => ({
    sessionId,
    resourceId,
    label,
  }));
  await db
    .delete(studySessionsStudyResources)
    .where(eq(studySessionsStudyResources.sessionId, sessionId));
  if (resourcesToAdd.length > 0) {
    await db.insert(studySessionsStudyResources).values(resourcesToAdd);
  }
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
  getSessionsDurationByDay,
};
