import { and, eq, between, desc, sql, or, ilike } from "drizzle-orm";
import { db } from "../index";
import { studyResources, studySessionsStudyResources } from "../schema";

export enum StudyResourceTypeEnum {
  VIDEO = "video",
  BOOK = "book",
  WEBSITE = "website",
  OTHER = "other",
}

export interface StudyResourceCreate {
  title: string;
  type: StudyResourceTypeEnum;
  desc?: string;
  url?: string;
}

export async function getResourceById(resourceId: string, userId: string) {
  const result = await db
    .select({
      resourceId: studyResources.resourceId,
      title: studyResources.title,
      type: studyResources.type,
      desc: studyResources.desc,
      url: studyResources.url,
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

export async function getResourceByTitle(title: string, userId: string) {
  const result = await db
    .select({
      resourceId: studyResources.resourceId,
    })
    .from(studyResources)
    .where(
      and(eq(studyResources.title, title), eq(studyResources.userId, userId))
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
      desc: studyResources.desc,
      url: studyResources.url,
    })
    .from(studyResources)
    .where(
      and(
        eq(studyResources.userId, userId),
        or(
          ilike(studyResources.title, `%${query}%`),
          ilike(studyResources.desc, `%${query}%`)
        )
      )
    ).orderBy(studyResources.title);
  return result;
}

export async function getStudyResourcesBySessionId(sessionId: string) {
  const result = await db
    .select({
      resourceId: studyResources.resourceId,
      title: studyResources.title,
      type: studyResources.type,
      desc: studyResources.desc,
      url: studyResources.url,
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
export async function replaceStudyResource(
  resourceId: string,
  resource: StudyResourceCreate
) {
  const [result] = await db
    .update(studyResources)
    .set(resource)
    .where(eq(studyResources.resourceId, resourceId))
    .returning();
  return result;
}
export async function addResourcesToSession(
  sessionId: string,
  resources: { resourceId: string; label?: string }[]
) {
  const resourcesToAdd = resources.map(({ resourceId, label }) => ({
    sessionId,
    resourceId,
    label,
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
  getResourceByTitle,
  replaceStudyResource,
};
