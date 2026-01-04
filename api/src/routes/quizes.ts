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
import { validatePaginationQuery } from "../utils/validatePagination";
import { validateFilterQuery } from "../utils/validateFilter";
import { validateTimeRangeQuery } from "../utils/validateTimeRange";

const validateCreateQuizAttempt = [
  param("quizId").isUUID().withMessage("Invalid quiz ID"),
  body("userAttemptContent")
    .isArray({ min: 1 })
    .withMessage("User attempt content must be an array and cannot be empty"),
  body("userAttemptContent.*")
    .isArray({ min: 1 })
    .withMessage("Answers must be an array and cannot be empty"),
  body("userAttemptContent.*.answers.*")
    .isIn(["A", "B", "C", "D", "E", "F"])
    .withMessage("Answers must be a boolean"),
];

const router = Router();

router.get(
  "/",
  requiredAuth,
  validate(validatePaginationQuery),
  validate(validateTimeRangeQuery),
  validate(validateFilterQuery),
  getUserQuizzes
);
router.get("/attempts/:quizAttemptId", requiredAuth, getQuizAttempt);
router.delete("/attempts/:quizAttemptId", requiredAuth, deleteQuizAttempt);
router.get("/:quizId/attempts", requiredAuth, getUserQuizAttempts);
router.post(
  "/:quizId/attempts",
  requiredAuth,
  validate(validateCreateQuizAttempt),
  createQuizAttempt
);
router.get("/:quizId", requiredAuth, getQuiz);
router.delete("/:quizId", requiredAuth, deleteQuiz);

export default router;
