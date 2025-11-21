import { and, eq, between, desc, sql } from "drizzle-orm";
import { db } from "../index";
import { studyResources, studySessions } from "../schema";
import { tags } from "../schema";

export interface studySessionCreate {
  userId: string;
  tagId: string;
  title: string;
  notes?: string;
  startedAt: Date;
  durationMinutes: number;
}
export interface studySessionUpdate {
  tagId?: string;
  title?: string;
  notes?: string;
  startedAt?: Date;
  durationMinutes?: number;
}

export interface studySessionResourceUpdate {
  title?: string;
  type?: studyResourceTypeEnum;
  content?: string;
}

export enum studyResourceTypeEnum {
  URL = "url",
  VIDEO = "video",
  BOOK = "book",
  OTHER = "other",
}
export interface studySessionResourceCreate {
  title: string;
  type: studyResourceTypeEnum;
  content?: string;
}
export interface studySessionResource extends studySessionResourceCreate {
  sessionId: string;
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
            'content', ${studyResources.content}
          )
        ) FILTER (WHERE ${studyResources.resourceId} IS NOT NULL),
      '[]')::json
    `.as("studyResources"),
    })
    .from(studySessions)
    .leftJoin(tags, eq(studySessions.tagId, tags.tagId))
    .leftJoin(
      studyResources,
      eq(studySessions.sessionId, studyResources.sessionId)
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
// ARRAY OF RESOURCES
export async function createStudySessionAndResources(
  session: studySessionCreate,
  resources: studySessionResource[]
) {
  const [result] = await db.insert(studySessions).values(session).returning();
  await db.insert(studyResources).values(resources);
  return result;
}
// put request
export async function replaceStudySession(
  sessionId: string,
  data: studySessionCreate
) {
  const [result] = await db
    .update(studySessions)
    .set(data)
    .where(eq(studySessions.sessionId, sessionId))
    .returning();
  return result;
}
// patch request
export async function updateStudySession(
  sessionId: string,
  updateData: studySessionUpdate
) {
  const updateFields: Partial<Omit<studySessionCreate, "userId">> = {};

  if (updateData.tagId !== undefined) {
    updateFields.tagId = updateData.tagId;
  }
  if (updateData.title !== undefined) {
    updateFields.title = updateData.title;
  }
  if (updateData.notes !== undefined) {
    updateFields.notes = updateData.notes;
  }
  if (updateData.startedAt !== undefined) {
    updateFields.startedAt =
      updateData.startedAt instanceof Date
        ? updateData.startedAt
        : new Date(updateData.startedAt);
  }
  if (updateData.durationMinutes !== undefined) {
    updateFields.durationMinutes = updateData.durationMinutes;
  }

  if (Object.keys(updateFields).length === 0) {
    return null;
  }

  const [result] = await db
    .update(studySessions)
    .set(updateFields)
    .where(eq(studySessions.sessionId, sessionId))
    .returning();
  return result;
}
// patch request
export async function replaceStudySessionResources(
  sessionId: string,
  resources: studySessionResource[]
) {
  await db
    .delete(studyResources)
    .where(eq(studyResources.sessionId, sessionId));
  await db.insert(studyResources).values(resources);
  return;
}
// METHOD TO ADD STUDY SESSION RESOURCE, DELETES RESOURCES IF [] IS PASSED, USED ONLY IN PATCH REQUEST
export async function updateStudySessionResources(
  sessionId: string,
  resources: (studySessionResourceCreate & { sessionId: string })[]
) {
  if (resources.length === 0) {
    await db
      .delete(studyResources)
      .where(eq(studyResources.sessionId, sessionId));
    return;
  }
  const result = db.insert(studyResources).values(resources);
  return result;
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
  createStudySessionAndResources,
  getSessionById,
  updateStudySession,
  updateStudySessionResources,
  replaceStudySession,
  replaceStudySessionResources,
  deleteStudySession,
};
