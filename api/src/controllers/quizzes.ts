import { Request, Response } from "express";
import quizzes, { quizAttemptCreate } from "../db/queries/quizzes";
import { matchedData, validationResult } from "express-validator";

export const getUserQuizzes = async (req: Request, res: Response) => {
  try {
    const result = await quizzes.getUserQuizzes(req.user!.userId);
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const getQuiz = async (
  req: Request<{ quizId: string }>,
  res: Response
) => {
  try {
    const { quizId } = req.params;
    const result = await quizzes.getQuiz(quizId, req.user!.userId);
    if (!result) {
      return res.sendStatus(404);
    }
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const createQuizAttempt = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { userAttemptContent } = matchedData<{ userAttemptContent: any }>(
      req
    );
    const quiz = await quizzes.getQuiz(req.params.quizId, req.user!.userId);
    if (!quiz) {
      return res.sendStatus(404);
    }
    if(quiz.numberOfQuestions !== userAttemptContent.length) {
      return res.status(400).json({ error: [{ msg: "User attempt content must be the same length as the number of questions. Received " + userAttemptContent.length + " answers, expected " + quiz.numberOfQuestions }] });
    }
    const quizAttempt: quizAttemptCreate = {
      quizId: quiz.quizId,
      userAttemptContent: userAttemptContent,
      score: "0",
    };
    const result = await quizzes.createQuizAttempt(quizAttempt);
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};


export const getUserQuizAttempts = async (
  req: Request<{ quizId: string }>,
  res: Response
) => {
  try {
    const { quizId } = req.params;
    const result = await quizzes.getQuizAttempts(quizId, req.user!.userId);
    if (!result) {
      return res.sendStatus(404);
    }
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const getQuizAttempt = async (req: Request, res: Response) => {
  try {
    const result = await quizzes.getQuizAttempt(req.params.quizAttemptId, req.user!.userId);
    if (!result) {
      return res.sendStatus(404);
    }
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const deleteQuiz = async (
  req: Request<{ quizId: string }>,
  res: Response
) => {
  try {
    const { quizId } = req.params;
    const quiz = await quizzes.getQuiz(quizId, req.user!.userId);
    if (!quiz) {
      return res.sendStatus(404);
    }
    await quizzes.deleteQuiz(quizId);
    return res.sendStatus(204);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const deleteQuizAttempt = async (
  req: Request<{ quizAttemptId: string }>,
  res: Response
) => {
  try {
    const { quizAttemptId } = req.params;
    const quizAttempt = await quizzes.getQuizAttempt(quizAttemptId, req.user!.userId);
    if (!quizAttempt) {
      return res.sendStatus(404);
    }
    await quizzes.deleteQuizAttempt(quizAttemptId);
    return res.sendStatus(204);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export default {
  getUserQuizzes,
  getQuiz,
  getUserQuizAttempts,
  getQuizAttempt,
  deleteQuiz,
  deleteQuizAttempt,
};
