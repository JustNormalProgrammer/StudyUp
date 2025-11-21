import { and, eq, between, desc, sql } from "drizzle-orm";
import { db } from "../index";
import { studyResources, studySessions } from "../schema";
import { tags } from "../schema";

export interface StudySessionCreate {
  userId: string;
  tagId: string;
  title: string;
  notes?: string;
  startedAt: Date;
  durationMinutes: number;
}
export type StudySessionUpdate = Partial<Omit<StudySessionCreate, "userId">>;

export enum StudyResourceTypeEnum {
  URL = "url",
  VIDEO = "video",
  BOOK = "book",
  OTHER = "other",
}
export interface StudySessionResource {
  sessionId: string;
  title: string;
  type: StudyResourceTypeEnum;
  content?: string;
}
export type StudySessionResourceCreate = Omit<StudySessionResource, "sessionId">;

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
  session: StudySessionCreate,
  resources: StudySessionResource[]
) {
  const [result] = await db.insert(studySessions).values(session).returning();
  await db.insert(studyResources).values(resources);
  return result;
}
// put request
export async function replaceStudySession(
  sessionId: string,
  data: StudySessionCreate
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
  updateData: StudySessionUpdate
) {
  console.log("updateData", updateData);
  const [result] = await db
    .update(studySessions)
    .set(updateData)
    .where(eq(studySessions.sessionId, sessionId))
    .returning();
  return result;
}
// patch request
export async function replaceStudySessionResources(
  sessionId: string,
  resources: StudySessionResource[]
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
  resources: StudySessionResourceCreate[]
) {
  if (resources.length === 0) {
    await db
      .delete(studyResources)
      .where(eq(studyResources.sessionId, sessionId));
    return null;
  }
  const resourcesData = resources.map((resource) => ({
    ...resource,
    sessionId,
  }));
  const result = await db.insert(studyResources).values(resourcesData).returning();
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
