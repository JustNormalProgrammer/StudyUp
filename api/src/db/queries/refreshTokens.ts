import { refreshTokens } from "../schema";
import { db } from "../index";
import { eq, and } from "drizzle-orm";


export async function upsertRefreshToken(userId: string, refreshToken: string) {
  await db
    .insert(refreshTokens)
    .values({ userId, refreshToken })
    .onConflictDoUpdate({
      target: refreshTokens.userId,
      set: { refreshToken },
    });
  return;
}

export async function getUserRefreshToken(
  userId: string,
  refreshToken: string
) {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.refreshToken, refreshToken),
        eq(refreshTokens.userId, userId)
      )
    );
  return result;
}
export async function removeRefreshToken(userId: string){
  await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  return;
}

export default {
  upsertRefreshToken,
  getUserRefreshToken,
  removeRefreshToken,
};