import { Request, Response } from "express";
import { validationResult, matchedData } from "express-validator";
import resources, { StudyResourceCreate } from "../db/queries/resources";
import sessions from "../db/queries/sessions";

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
export const getResourcesBySessionId = async (
  req: Request<{ sessionId: string }>,
  res: Response
) => {
  const { sessionId } = req.params;
  try {
    const existingSession = await sessions.getSessionById(
      sessionId,
      req.user!.userId
    );
    if (!existingSession) {
      return res.sendStatus(404);
    }
    const result = await resources.getStudyResourcesBySessionId(sessionId);
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
    const { title, type, desc, url } = matchedData<StudyResourceCreate>(req);
    const result = await resources.createStudyResource(
      { title, type, desc, url },
      req.user!.userId
    );
    return res.json(result[0]);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
export const replaceResource = async (
  req: Request<{ resourceId: string }>,
  res: Response
) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { resourceId } = req.params;
    const existingResource = await resources.getResourceById(
      resourceId,
      req.user!.userId
    );
    if (!existingResource) {
      return res.sendStatus(404);
    }
    const resourceData = matchedData<StudyResourceCreate>(req);
    const result = await resources.replaceStudyResource(
      resourceId,
      resourceData
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
