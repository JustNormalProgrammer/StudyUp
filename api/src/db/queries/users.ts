import { and, eq, or} from "drizzle-orm";
import { db } from "../index";
import { users } from "../schema";

export interface UserRegister{
  username: string;
  password: string;
  email: string;
}
export interface UserLogin{
  email: string;
  password: string;
}

export async function getUserByUsername(username: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return result;
}
export async function getUserByEmail(email: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result;
}
export async function getUserById(id: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.userId, id))
    .limit(1);
  return result;
}
// login can be username or email
export async function getUserByCredentials(
  email: string,
  passwordHash: string
) {
  const [result] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.password, passwordHash)))
    .limit(1);
  return result;
}
export async function createUser(data: UserRegister) {
  const [result] = await db
    .insert(users)
    .values({...data})
    .returning();
  return result;
}
export default {
  getUserByUsername,
  getUserByEmail,
  getUserById,
  getUserByCredentials,
  createUser,
};
