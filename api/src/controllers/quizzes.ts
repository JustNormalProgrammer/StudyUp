import { Request, Response } from "express";
import quizzes, { QuizAttemptCreate } from "../db/queries/quizzes";
import { matchedData, validationResult } from "express-validator";
import { QuestionType, QuizType } from "./sessions";

export type QuizAttemptContent = Array<
  Array<"A" | "B" | "C" | "D" | "E" | "F" | undefined>
>;

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
    const { userAttemptContent } = matchedData<{
      userAttemptContent: QuizAttemptContent;
    }>(req);
    const quiz = await quizzes.getQuiz(req.params.quizId, req.user!.userId);
    if (!quiz) {
      return res.sendStatus(404);
    }
    if (quiz.numberOfQuestions !== userAttemptContent.length) {
      return res.status(400).json({
        error: [
          {
            msg:
              "User attempt content must be the same length as the number of questions. Received " +
              userAttemptContent.length +
              " answers, expected " +
              quiz.numberOfQuestions,
          },
        ],
      });
    }

    let totalScore = 0;
    let maxScore = 0;
    const questionResults = (quiz.quizContent as QuizType).map(
      (question: QuestionType) => {
        const userAnswers =
          userAttemptContent[question.questionNumber - 1] ?? [];

        let questionScore = 0;
        let questionMaxScore = 0;

        const correctAnswers = question.questionChoices.filter(
          (c) => c.isCorrect
        ).map((c) => c.id);

        if (question.isMultipleChoice) {
          questionMaxScore = question.questionChoices.length === 4 ? 2 : 3;

          const wrongAnswers = question.questionChoices.filter(
            (c) => !c.isCorrect
          ).map((c) => c.id);

          const correctSelected = correctAnswers.filter((id) =>
            userAnswers.includes(id)
          ).length;

          const wrongSelected = wrongAnswers.filter((id) =>
            userAnswers.includes(id)
          ).length;

          const scoreRatio =
            correctSelected / correctAnswers.length -
            wrongSelected / wrongAnswers.length;

          questionScore = Math.max(0, scoreRatio * questionMaxScore);
        } else {
          questionMaxScore = 1;
          if (userAnswers[0] === correctAnswers[0]) {
            questionScore = 1;
          }
        }

        totalScore += questionScore;
        maxScore += questionMaxScore;

        return {
          questionNumber: question.questionNumber,
          isMultipleChoice: question.isMultipleChoice,
          userAnswers,
          correctAnswers,
          isCorrect: questionScore === questionMaxScore,
          score: Number(questionScore.toFixed(2)),
          maxScore: questionMaxScore,
        };
      }
    );
    const quizAttempt: QuizAttemptCreate = {
      quizId: quiz.quizId,
      userAttemptContent: questionResults,
      score: totalScore.toString(),
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

export const getQuizAttempt = async (
  req: Request<{ quizAttemptId: string }>,
  res: Response
) => {
  const { quizAttemptId } = req.params;
  try {
    const result = await quizzes.getQuizAttempt(
      quizAttemptId,
      req.user!.userId
    );
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
    const quizAttempt = await quizzes.getQuizAttempt(
      quizAttemptId,
      req.user!.userId
    );
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
