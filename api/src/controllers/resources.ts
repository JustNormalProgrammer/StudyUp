import { Request, Response } from "express";
import { validationResult, matchedData } from "express-validator";
import resources, { StudyResourceCreate } from "../db/queries/resources";

export const getResources = async (
  req: Request<{}, {}, {}, { q: string }>,
  res: Response
) => {
  const { q = "" } = req.query;
  try {
    const result = await resources.getStudyResources(req.user!.userId, q);
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const getResourceById = async (
  req: Request<{ resourceId: string }>,
  res: Response
) => {
  const { resourceId } = req.params;
  try {
    const result = await resources.getResourceById(
      resourceId,
      req.user!.userId
    );
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
export const createResource = async (req: Request, res: Response) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { title, type, content } = matchedData<StudyResourceCreate>(req);
    const result = await resources.createStudyResource(
      { title, type, content },
      req.user!.userId
    );
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
export const deleteResource = async (
  req: Request<{ resourceId: string }>,
  res: Response
) => {
  try {
    const { resourceId } = req.params;
    await resources.deleteStudyResource(resourceId);
    return res.sendStatus(204);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
