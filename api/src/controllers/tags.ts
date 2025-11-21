import { matchedData, validationResult } from "express-validator";
import tags from "../db/queries/tags";
import { Request, Response } from "express";
import { TagCreate } from "../db/queries/tags";

export const getUserTags = async (req: Request, res: Response) => {
  try {
    const result = await tags.getTagsByUserId(req.user!.userId);
    return res.json(result);
  } catch (e) {
    return res.sendStatus(500);
  }
};
export const createTag = async (req: Request, res: Response) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { content, color } = matchedData<Omit<TagCreate, "userId">>(req);
    const tag: TagCreate = {
      userId: req.user!.userId,
      content,
      color,
    };
    const result = await tags.createTag(tag);
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
export const deleteTag = async (req: Request<{ tagId: string }>, res: Response) => {
  try {
    const { tagId } = req.params;
    const existingTag = await tags.getTagById(tagId, req.user!.userId);
    if (!existingTag) {
      return res.sendStatus(404);
    }
    await tags.deleteTag(tagId, req.user!.userId);
    return res.sendStatus(204);
  }
  catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const updateTag = async (req: Request<{ tagId: string }>, res: Response) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { tagId } = req.params;
    const existingTag = await tags.getTagById(tagId, req.user!.userId);
    if (!existingTag) {
      return res.sendStatus(404);
    }
    const { content, color } = matchedData<Omit<TagCreate, "userId">>(req);
    const tag: TagCreate = {
      userId: req.user!.userId,
      content,
      color,
    };
    const result = await tags.updateTag(tagId, tag, req.user!.userId);
    return res.json(result);
  }
  catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};