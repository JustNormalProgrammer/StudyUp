import sessions, {
  studySessionCreate,
  studySessionResourceCreate,
  studySessionUpdate,
  PaginationQuery,
} from "../db/queries/sessions";
import { Request, Response } from "express";
import { validationResult, matchedData } from "express-validator";
import tags from "../db/queries/tags";

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
        Omit<studySessionCreate, "userId"> & {
          studyResources: studySessionResourceCreate[];
        }
      >(req);
    const session: studySessionCreate = {
      userId: req.user!.userId,
      tagId,
      title,
      startedAt: new Date(startedAt),
      durationMinutes,
      notes,
    };
    const studyResourcesData = studyResources.map((resource) => ({
      ...resource,
      sessionId: req.user!.userId,
    }));
    const result = await sessions.createStudySessionAndResources(
      session,
      studyResourcesData
    );
    // NO IDEA MAYBE TODO
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
      Omit<studySessionCreate, "userId"> & {
        studyResources: studySessionResourceCreate[];
      }
    >(req);
    const existingSession = await sessions.getSessionById(
      sessionId,
      req.user!.userId
    );
    if (!existingSession) {
      return res.sendStatus(404);
    }
    const session: studySessionCreate = {
      userId: req.user!.userId,
      ...sessionData,
    };
    await sessions.replaceStudySession(sessionId, session);
    const studyResourcesData = studyResources.map((resource) => ({
      ...resource,
      sessionId,
    }));
    await sessions.replaceStudySessionResources(sessionId, studyResourcesData);
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
// patch request
export const updateSession = async (
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
      studySessionUpdate & { studyResources?: studySessionResourceCreate[] }
    >(req);
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
    const updateResourcesData = studyResources?.map((resource) => ({
      ...resource,
      sessionId,
    }));
    await sessions.updateStudySessionResources(
      sessionId,
      updateResourcesData || []
    );

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
