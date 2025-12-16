import { Request, Response } from "express";
import quizzes, { QuizAttemptCreate } from "../db/queries/quizzes";
import { matchedData, validationResult } from "express-validator";
import { GoogleGenAI } from "@google/genai";
import sessions from "../db/queries/sessions";
import resources from "../db/queries/resources";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const session = await sessions.getSessionById(
      "2528dea5-6c6d-42de-98d2-b829c99aad04",
      req.user!.userId
    );
    const sessionResources = await resources.getStudyResourcesBySessionId(
      "2528dea5-6c6d-42de-98d2-b829c99aad04"
    );
    const quizData = {
      session,
      sessionResources,
      isMultipleChoice: true,
      numberOfQuestions: 5,
    };
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User just studied something using some resources. He wrote down what he was studying, resources he used to study and more.
Your task is to create a quiz with questions that verify user's newly acquired knowledge based on the data provided. Provided data is a JSON object containing
properties depicting user's study session. This JSON document comprises of 2 main objects: session and resources.
session object:
title - the title of user's study session,
notes - additional description provided by user (optional)
and other non-essential data that you can omit.
resources object is an array of resources each of which are comprised of:
title - title of the resource,
desc - additional description provided by user (optional),
url - link to the resource
label - short label defining the scope in which the resource is used
and other non-essential data that you can omit.
You will also receive property isMultipleChoice and numberOfQuestions. isMultipleChoice property is a boolean and specifies whether generated quiz should
be only single choice or can have questions where multiple answers are correct. Please keep in mind, that if isMultipleChoice is true
quiz should contain both single and multiple answer questions and should not be comprised of only one type of question.
numberOfQuestions is a number and specifies the number of question generated quiz should have.
Your response should be a JSON object which adheres to the following schema:
 [

        "questionNumber": number,

        "questionContent": string,

        "isMultipleChoice": boolean

        "questionChoices": [

            {

                "id": string,

                "content": string,

                "isCorrect": boolean,

            }

        ],

        "questionNumber": number,

        "questionContent": string,

        "isMultipleChoice": boolean

        "questionChoices": [

            {

                "id": string,

                "content": string,

                "isCorrect": boolean,

            }

        ]

  and other...
]
This schema is an of array of questions. Each question is an object comprised of:
questionNumber - number of question, starts with 1,
questionContent - the content of the question,
isMultipleChoice - wether that specific question can have multiple correct answers,
questionChoices object comprised of:
id - identifier of question choice. This id is a capitalized letter. Question choices start with a letter A follow alphabetical order. (question with 4 answers should have: A, B, C, D),
content - content of question choice
isCorrect - wether this specific question choice is a correct answer.
Each question by default should have 4 possible answers with id's A, B, C, D.
If question is multiple choice, it must have at least 4 possible answers, but no more than 6.
Each question, wether multiple choice, or not must have at least one correct answer.
Question with property isMultipleChoice equal true, can have 1, 2, 3, 4, 5 or even 6 correct answers.
All content must not have any escape characters or sequences. 
DON'T USE ANY TEXT DECORATORS. THE CONTENT OF QUESTIONS AND ANSWERS WILL BE DISPLAYED WITH JSX WITHOUT ANY STYLING.
All content should be written in English, doesn't matter in which language the provided data is.

Data: ${JSON.stringify(quizData)}`,
      config: {
        responseMimeType: "application/json",
      },
    });
    return res.json(JSON.parse(response.text || "[]"));
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

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
    const quizAttempt: QuizAttemptCreate = {
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
    const result = await quizzes.getQuizAttempt(
      req.params.quizAttemptId,
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
