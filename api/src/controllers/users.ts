import users from "../db/queries/users";
import { Request, Response } from "express";

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user!.userId) return res.sendStatus(400);
    const result = await users.getUserById(req.user!.userId);
    return res.json({
      userId: result.userId,
      username: result.username,
    });
  } catch (e) {
    return res.sendStatus(500);
  }
};
