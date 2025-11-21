import { and, eq } from "drizzle-orm";
import { db } from "../index";
import { tags } from "../schema";

export interface TagCreate {
  userId: string;
  content: string;
  color: string;
}

export const getTagsByUserId = async (userId: string) => {
  const userTags = await db.select().from(tags).where(eq(tags.userId, userId));
  return userTags;
};

export const getTagById = async (tagId: string, userId: string) => {
  const [result] = await db.select().from(tags).where(and(eq(tags.tagId, tagId), eq(tags.userId, userId))).limit(1);
  return result;
};

export const createTag = async (tag: TagCreate) => {
  const [result] = await db.insert(tags).values(tag).returning();
  return result;
};

export const deleteTag = async(tagId: string, userId: string) => {
  await db.delete(tags).where(and(eq(tags.tagId, tagId), eq(tags.userId, userId))).returning();
  return;
};

export const updateTag = async(tagId: string, tag: TagCreate, userId: string) => {
  const [result] = await db.update(tags).set(tag).where(and(eq(tags.tagId, tagId), eq(tags.userId, userId))).returning();
  return result;
};

export default {
  getTagsByUserId,
  getTagById,
  createTag,
  deleteTag,
  updateTag,
};