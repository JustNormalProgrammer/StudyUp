import { and, eq, between, desc, sql } from "drizzle-orm";
import { db } from "../index";
import {
  studyResources,
  studySessions,
  studySessionsStudyResources,
} from "../schema";
import { tags } from "../schema";
import { StudyResourceTypeEnum } from "./resources";

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
  page?: number;
  itemsOnPage?: number;
}

export async function getSessions(data: PaginationQuery) {
  const { userId, from, to, page = 1, itemsOnPage = 10 } = data;
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
    .offset((page - 1) * itemsOnPage)
    .limit(itemsOnPage);
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
      studyResources: sql`
        COALESCE(
          json_agg(
            json_build_object(
              'resourceId', ${studyResources.resourceId},
              'title', ${studyResources.title},
              'type', ${studyResources.type},
              'content', ${studyResources.content},
              'label', ${studySessionsStudyResources.label}
            )
          ) FILTER (WHERE ${studyResources.resourceId} IS NOT NULL),
        '[]')::json
      `.as("studyResources"),
    })
    .from(studySessions)
    .leftJoin(tags, eq(studySessions.tagId, tags.tagId))
    .leftJoin(
      studySessionsStudyResources,
      eq(studySessions.sessionId, studySessionsStudyResources.sessionId)
    )
    .leftJoin(
      studyResources,
      eq(studySessionsStudyResources.resourceId, studyResources.resourceId)
    )
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
