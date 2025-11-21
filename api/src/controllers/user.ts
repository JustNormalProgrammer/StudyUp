import { Request, Response } from "express";
import { validationResult, matchedData } from "express-validator";
import { PaginationQuery } from "../db/queries/sessions";
import sessions from "../db/queries/sessions";
import quizzes from "../db/queries/quizzes";
import users from "../db/queries/users";
export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const user = await users.getUserById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ error: [{ msg: "User not found" }] });
    }
    return res.json({
      userId: user.userId,
      username: user.username,
      email: user.email,
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
    const { from, to, page, itemsOnPage } = matchedData<Omit<PaginationQuery, "userId">>(req);
    const data: PaginationQuery = {
      userId: req.user!.userId,
      from: from ? new Date(from) : new Date(0),
      to: to ? new Date(to) : new Date(),
      page,
      itemsOnPage,
    };
    const userSessions = await sessions.getSessions(data);
    const userQuizzesAttempts = await quizzes.getUserAttempts(data);
    return res.json({ userSessions, userQuizzesAttempts });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};


