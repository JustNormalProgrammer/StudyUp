import { eq } from "drizzle-orm";
import { db } from "../index";
import { tags } from "../schema";

export const getTagsByUserId = async (userId: string) => {
  const userTags = await db.select().from(tags).where(eq(tags.userId, userId));
  return userTags;
};

export default {
  getTagsByUserId,
};