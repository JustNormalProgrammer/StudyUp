import { Request, Response } from "express";
import { validationResult, matchedData } from "express-validator";
import { PaginationQuery } from "../db/queries/sessions";
import sessions from "../db/queries/sessions";
import quizzes from "../db/queries/quizzes";
import user from "../db/queries/user";

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const foundUser = await user.getUserById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ error: [{ msg: "User not found" }] });
    }
    return res.json({
      userId: foundUser.userId,
      username: foundUser.username,
      email: foundUser.email,
    });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const getUserEvents = async (req: Request, res: Response) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { from, to, start, limit } = matchedData<PaginationQuery>(req);
    let userSessions = await sessions.getSessions(req.user!.userId, {
      from,
      to,
      start,
      limit,
    });
    let userQuizzesAttempts = await quizzes.getUserAttempts(req.user!.userId, {
      from,
      to,
      start,
      limit,
    });
    return res.json({ userSessions, userQuizzesAttempts });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const getUserEventsChart = async (req: Request, res: Response) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { from, to, start, limit } = matchedData<PaginationQuery>(req);
    const userSessions = await sessions.getSessionsDurationByDay(
      req.user!.userId,
      {
        from,
        to,
        start,
        limit,
      }
    );
    console.log(userSessions);
    return res.json(userSessions);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
