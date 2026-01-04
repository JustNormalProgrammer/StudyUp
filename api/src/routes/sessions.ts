import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import {
  getSessions,
  getSessionById,
  createSession,
  deleteSession,
  replaceSession,
  createQuiz,
  getSessionQuizzes,
} from "../controllers/sessions";
import { body } from "express-validator";
import validate from "../utils/validate";
import { getResourcesBySessionId } from "../controllers/resources";
import { validatePaginationQuery } from "../utils/validatePagination";
import { validateFilterQuery } from "../utils/validateFilter";
import { validateTimeRangeQuery } from "../utils/validateTimeRange";

const validateCreateSession = [
  body("tagId").notEmpty().withMessage("Tag is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("notes").optional().notEmpty().withMessage("Notes cannot be empty"),
  body("startedAt")
    .notEmpty()
    .withMessage("Starting time is required")
    .isISO8601()
    .withMessage("Starting time must be a valid date")
    .toDate()
    .custom(async (value) => {
      if (value > new Date()) {
        throw new Error("Date cannot be set in the future");
      }
      return true;
    }),
  body("durationMinutes")
    .notEmpty()
    .withMessage("Duration minutes is required")
    .isInt({ min: 0 })
    .withMessage("Duration minutes must be a positive integer"),
  body("studyResources")
    .isArray()
    .withMessage("Study resources must be an array"),
  body("studyResources.*.resourceId")
    .isUUID()
    .withMessage("Each resource must have a resourceId that is a valid UUID"),
  body("studyResources.*.label")
    .optional()
    .isString()
    .withMessage("Label must be a string"),
];

const validateCreateQuiz = [
  body("title").notEmpty().withMessage("Title is required"),
  body("numberOfQuestions")
    .notEmpty()
    .withMessage("Number of questions is required")
    .isInt({ min: 1, max: 10 })
    .withMessage(
      "Number of questions must be a positive integer between 1 and 10"
    ),
  body("isMultipleChoice")
    .notEmpty()
    .withMessage("Is multiple choice is required")
    .isBoolean()
    .withMessage("Is multiple choice must be a boolean"),
  body("additionalInfo")
    .optional()
    .notEmpty()
    .withMessage("Additional information cannot be empty"),
];


const router = Router();

router.get(
  "/",
  requiredAuth,
  validate(validatePaginationQuery),
  validate(validateTimeRangeQuery),
  validate(validateFilterQuery),
  getSessions
);
router.post("/", requiredAuth, validate(validateCreateSession), createSession);
router.get("/:sessionId", requiredAuth, getSessionById);
router.get("/:sessionId/resources", requiredAuth, getResourcesBySessionId);
router.put(
  "/:sessionId",
  requiredAuth,
  validate(validateCreateSession),
  replaceSession
);
router.delete("/:sessionId", requiredAuth, deleteSession);
router.post(
  "/:sessionId/quizzes",
  requiredAuth,
  validate(validateCreateQuiz),
  createQuiz
);
router.get("/:sessionId/quizzes", requiredAuth, getSessionQuizzes);
export default router;
