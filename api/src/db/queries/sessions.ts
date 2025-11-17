import { and, eq, or, between, desc } from "drizzle-orm";
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
export interface getSessionQuery {
  userId: string;
  from: Date;
  to: Date;
  page?: number;
  itemsOnPage?: number;
}

export async function getSessions(data: getSessionQuery) {
  const { userId, from, to, page = 1, itemsOnPage = 10 } = data;
  const result = await db
    .select({
      sessionId: studySessions.sessionId,
      tagId: studySessions.tagId,
      title: studySessions.title,
      notes: studySessions.notes,
      startedAt: studySessions.startedAt,
      durationMinutes: studySessions.durationMinutes,
      tagContent: tags.content,
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
export async function getSessionById(sessionId: string) {
  const [result] = await db
    .select({
      sessionId: studySessions.sessionId,
      tagId: tags.tagId,
      title: studySessions.title,
      notes: studySessions.notes,
      startedAt: studySessions.startedAt,
      durationMinutes: studySessions.durationMinutes,
      tagContent: tags.content,
      resourcesTitle: studyResources.title,
      resourcesType: studyResources.type,
      resourcesContent: studyResources.content,
    })
    .from(studySessions)
    .leftJoin(tags, eq(studySessions.tagId, tags.tagId))
    .leftJoin(studyResources, eq(studySessions.sessionId, studyResources.sessionId))
    .where(eq(studySessions.sessionId, sessionId))
    .limit(1);
  return result;
}
export async function createStudySessionAndResources(
  session: studySessionCreate,
  resources: studySessionResourceCreate[]
) {
  const [result] = await db.insert(studySessions).values(session).returning();
  for (const resource of resources) {
    const sessionResource: studySessionResource = {
      ...resource,
      sessionId: result.sessionId,
    };
    await createStudySessionResource(sessionResource);
  }
  return result;
}

export async function createStudySessionResource(
  resource: studySessionResource
) {
  const [result] = await db.insert(studyResources).values(resource).returning();
  return result;
}

export default {
  getSessions,
  createStudySessionAndResources,
  createStudySessionResource,
  getSessionById,
};
