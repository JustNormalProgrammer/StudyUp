import sessions, {
  StudySessionCreate,
  PaginationQuery,
} from "../db/queries/sessions";
import resources from "../db/queries/resources";
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
    const { from, to, page, itemsOnPage } =
      matchedData<Omit<PaginationQuery, "userId">>(req);
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
    const result = await sessions.getSessionById(sessionId, req.user!.userId);
    if (!result) {
      return res.status(404).json({ error: "Session not found" });
    }
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
        Omit<StudySessionCreate, "userId"> & {
          studyResources: string[];
        }
      >(req);
    const session: StudySessionCreate = {
      userId: req.user!.userId,
      tagId,
      title,
      startedAt: new Date(startedAt),
      durationMinutes,
      notes,
    };
    const result = await sessions.createStudySession(session);
    if(studyResources.length > 0) {
      await resources.addResourcesToSession(result.sessionId, studyResources);
    }
    const updatedSession = await sessions.getSessionById(
      result.sessionId,
      req.user!.userId
    );
    return res.json(updatedSession);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

//put request
export const replaceSession = async (
  req: Request<{ sessionId: string }>,
  res: Response
) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { sessionId } = req.params;
    const { studyResources, ...sessionData } = matchedData<
      Omit<StudySessionCreate, "userId"> & {
        studyResources: string[];
      }
    >(req);
    const existingSession = await sessions.getSessionById(
      sessionId,
      req.user!.userId
    );
    if (!existingSession) {
      return res.sendStatus(404);
    }
    await sessions.updateStudySession(sessionId, sessionData);
    await sessions.updateStudySessionResources(sessionId, studyResources);
    const updatedSession = await sessions.getSessionById(
      sessionId,
      req.user!.userId
    );
    return res.json(updatedSession);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
// patch request =========== OLD VERSION ====================
/* export const updateSession = async (
  req: Request<{ sessionId: string }>,
  res: Response
) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { sessionId } = req.params;
    const data = matchedData<
      StudySessionUpdate & {
        studyResources?: StudySessionResourceCreate[];
      }
    >(req);
    console.log("data", data);
    const existingSession = await sessions.getSessionById(
      sessionId,
      req.user!.userId
    );
    if (!existingSession) {
      return res.sendStatus(404);
    }
    const { studyResources, ...sessionUpdateData } = data;
    if (Object.keys(sessionUpdateData).length > 0) {
      await sessions.updateStudySession(sessionId, sessionUpdateData);
    }
    await sessions.updateStudySessionResources(sessionId, studyResources || []);
    const updatedSession = await sessions.getSessionById(
      sessionId,
      req.user!.userId
    );
    return res.json(updatedSession);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
}; */

export const deleteSession = async (
  req: Request<{ sessionId: string }>,
  res: Response
) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { sessionId } = req.params;
    const existingSession = await sessions.getSessionById(
      sessionId,
      req.user!.userId
    );
    if (!existingSession) {
      return res.sendStatus(404);
    }
    await sessions.deleteStudySession(sessionId);
    return res.sendStatus(204);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
