import { and, eq, between, desc, sql, or, ilike } from "drizzle-orm";
import { db } from "../index";
import { studyResources, studySessionsStudyResources } from "../schema";

export enum StudyResourceTypeEnum {
  URL = "url",
  VIDEO = "video",
  BOOK = "book",
  OTHER = "other",
}

export interface StudyResourceCreate {
  title: string;
  type: StudyResourceTypeEnum;
  content?: string;
}

export async function getResourceById(resourceId: string, userId: string) {
  const result = await db
    .select({
      resourceId: studyResources.resourceId,
      title: studyResources.title,
      type: studyResources.type,
      content: studyResources.content,
    })
    .from(studyResources)
    .where(
      and(
        eq(studyResources.resourceId, resourceId),
        eq(studyResources.userId, userId)
      )
    )
    .limit(1);
  return result[0];
}

export async function getStudyResources(userId: string, query: string = "") {
  const result = await db
    .select({
      resourceId: studyResources.resourceId,
      title: studyResources.title,
      type: studyResources.type,
      content: studyResources.content,
    })
    .from(studyResources)
    .where(
      and(
        eq(studyResources.userId, userId),
        or(
          ilike(studyResources.title, `%${query}%`),
          ilike(studyResources.content, `%${query}%`)
        )
      )
    );
  return result;
}

export async function getStudyResourcesBySessionId(sessionId: string) {
  const result = await db
    .select({
      resourceId: studyResources.resourceId,
      title: studyResources.title,
      type: studyResources.type,
      content: studyResources.content,
    })
    .from(studyResources)
    .innerJoin(
      studySessionsStudyResources,
      eq(studyResources.resourceId, studySessionsStudyResources.resourceId)
    )
    .where(eq(studySessionsStudyResources.sessionId, sessionId));
  return result;
}

export async function createStudyResource(
  resource: StudyResourceCreate,
  userId: string,
  sessionId?: string
) {
  const result = await db
    .insert(studyResources)
    .values({
      ...resource,
      userId,
    })
    .returning();
  if (sessionId) {
    await db.insert(studySessionsStudyResources).values({
      sessionId,
      resourceId: result[0].resourceId,
    });
  }
  return result;
}

export async function addResourcesToSession(
  sessionId: string,
  resourceId: string[]
) {
  const resourcesToAdd = resourceId.map((id) => ({
    sessionId,
    resourceId: id,
  }));
  await db.insert(studySessionsStudyResources).values(resourcesToAdd);
}

export async function deleteStudyResource(resourceId: string) {
  await db
    .delete(studyResources)
    .where(eq(studyResources.resourceId, resourceId));
}

export default {
  getResourceById,
  getStudyResources,
  getStudyResourcesBySessionId,
  createStudyResource,
  deleteStudyResource,
  addResourcesToSession,
};
