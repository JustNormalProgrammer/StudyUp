import tags from "../db/queries/tags";
import { Request, Response } from "express";

export const getUserTags = async (req: Request, res: Response) => {
  try {
    const result = await tags.getTagsByUserId(req.user!.userId);
    return res.json(result);
  } catch (e) {
    return res.sendStatus(500);
  }
};