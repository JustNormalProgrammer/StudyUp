import sessions, {
  studySessionCreate,
  studySessionResourceCreate,
} from "../db/queries/sessions";
import { Request, Response } from "express";
import { validationResult, matchedData } from "express-validator";

export const getSessions = async (req: Request, res: Response) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { from, to, page, itemsOnPage } = matchedData<{
      from: string;
      to: string;
      page: number;
      itemsOnPage: number;
    }>(req);
    console.log(from, to, page, itemsOnPage);
    const result = await sessions.getSessions({
      userId: req.user!.userId,
      from: from ? new Date(from) : new Date(0),
      to: to ? new Date(to) : new Date(),
      page,
      itemsOnPage,
    });
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
export const getSessionById = async (
  req: Request<{ sessionId: string }>,
  res: Response
) => {
  try {
    const { sessionId } = req.params;
    const result = await sessions.getSessionById(sessionId);
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
export const createSession = async (req: Request, res: Response) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { tagId, title, startedAt, durationMinutes, notes, studyResources } =
      matchedData<
        studySessionCreate & { studyResources: studySessionResourceCreate[] }
      >(req);
    const session: studySessionCreate = {
      userId: req.user!.userId,
      tagId,
      title,
      startedAt: new Date(startedAt),
      durationMinutes,
      notes,
    };
    const result = await sessions.createStudySessionAndResources(session, [
      ...studyResources,
    ]);
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
