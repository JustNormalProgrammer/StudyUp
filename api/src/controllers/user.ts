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

export const getUserSettings = async (req: Request, res: Response) => {
  try {
    const result = await user.getUserSettings(req.user!.userId);
    return res.json(result);
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

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const result = await user.getUserStats(req.user!.userId);
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const getUserChartData = async (req: Request, res: Response) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  try {
    const { from, to, goal } = matchedData<{ from: Date; to: Date, goal: boolean}>(req);
    if (goal) {
      const result = await user.getUserProgressData(req.user!.userId, from, to);
      return res.json(result);
    }
    const result = await user.getUseBarChartData(req.user!.userId, from, to);
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const updateUserSettings = async (req: Request, res: Response) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res
      .status(400)
      .json({ error: valResult.array({ onlyFirstError: true }) });
  }
  const { dailyStudyGoal, weeklyQuizGoal } = matchedData<{ dailyStudyGoal: number; weeklyQuizGoal: number }>(req);
  if (!(dailyStudyGoal || weeklyQuizGoal)) {
    return res.status(400).json({error: [{msg: "No values set"}]});
  }
  try {
    const result = await user.updateUserSettings(
      req.user!.userId,
      { dailyStudyGoal, weeklyQuizGoal }
    );
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
