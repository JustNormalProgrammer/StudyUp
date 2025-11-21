import Router from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import {
  deleteQuiz,
  deleteQuizAttempt,
  getQuiz,
  getQuizAttempt,
  getUserQuizAttempts,
  getUserQuizzes,
  createQuizAttempt,
} from "../controllers/quizzes";
import { body, param } from "express-validator";
import validate from "../utils/validate";

const validateCreateQuizAttempt = [
  param("quizId").isUUID().withMessage("Invalid quiz ID"),
  body("userAttemptContent")
    .isArray({ min: 1 })
    .withMessage("User attempt content must be an array and cannot be empty"),
  body("userAttemptContent.*")
    .isArray({ min: 1 })
    .withMessage("Answers must be an array and cannot be empty"),
  body("userAttemptContent.*.answers.*")
    .isBoolean()
    .withMessage("Answers must be a boolean"),
];

const router = Router();

router.get("/", requiredAuth, getUserQuizzes);
router.get("/:quizId", requiredAuth, getQuiz);
router.delete("/:quizId", requiredAuth, deleteQuiz);
router.post(
  "/:quizId/attempts",
  requiredAuth,
  validate(validateCreateQuizAttempt),
  createQuizAttempt
);
router.get("/:quizId/attempts", requiredAuth, getUserQuizAttempts);
router.get("/attempts/:quizAttemptId", requiredAuth, getQuizAttempt);
router.delete("/attempts/:quizAttemptId", requiredAuth, deleteQuizAttempt);

export default router;
