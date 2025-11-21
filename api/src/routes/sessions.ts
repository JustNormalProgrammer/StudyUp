import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import {
  createSession,
  deleteSession,
  getSessionById,
  getSessions,
  replaceSession,
  updateSession,
} from "../controllers/sessions";
import { body, query } from "express-validator";
import validate from "../utils/validate";
import { studyResourceTypeEnum } from "../db/queries/sessions";
import tags from "../db/queries/tags";

const validateCreateSession = [
  body("tagId").notEmpty().withMessage("Tag is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("notes").optional().notEmpty().withMessage("Notes cannot be empty"),
  body("startedAt").notEmpty().withMessage("Starting time is required").isISO8601().withMessage("Starting time must be a valid date").toDate(),
  body("durationMinutes")
    .notEmpty()
    .withMessage("Duration minutes is required")
    .isInt({ min: 0 })
    .withMessage("Duration minutes must be a positive integer"),
  body("studyResources")
    .isArray()
      .withMessage("Study resources must be an array"),
  body("studyResources.*.title")
    .trim()
    .notEmpty()
    .withMessage("Study resource title is required"),
  body("studyResources.*.type")
    .trim()
    .notEmpty()
    .withMessage("Study resource type is required"),
  body("studyResources.*.content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Study resource content cannot be empty"),
  body("studyResources.*.type")
    .custom((value) => {
      if (!Object.values(studyResourceTypeEnum).includes(value)) {
        throw new Error("Invalid study resource type");
      }
      return true;
    })
    .withMessage("Invalid study resource type"),
  body("tagId").custom(async (value, { req }) => {
    if (value) {
      const existingTag = await tags.getTagById(value, req.user!.userId);
      if (!existingTag) {
        throw new Error("Tag not found");
      }
    }
    return true;
  }),
];

const validateUpdateSession = [
  body("tagId").optional().notEmpty().withMessage("Tag is required"),
  body("title").optional().notEmpty().withMessage("Title is required"),
  body("notes").optional().notEmpty().withMessage("Notes is required"),
  body("startedAt")
    .optional()
    .notEmpty()
    .withMessage("Starting time is required").isISO8601().withMessage("Starting time must be a valid date").toDate(),
  body("durationMinutes")
    .optional()
    .notEmpty()
    .withMessage("Duration minutes is required")
    .isInt({ min: 0 })
    .withMessage("Duration minutes must be a positive integer"),
  body("studyResources")
    .optional()
    .isArray()
    .withMessage("Study resources must be an array"),
  body("studyResources.*.resourceId")
    .optional()
    .notEmpty()
    .withMessage("Study resource ID cannot be empty"),
  body("studyResources.*.title")
    .trim()
    .notEmpty()
    .withMessage("Study resource title is required"),
  body("studyResources.*.type")
    .trim()
    .notEmpty()
    .withMessage("Study resource type is required"),
  body("studyResources.*.content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Study resource content is required"),
  body("studyResources.*.type")
    .custom((value) => {
      if (!Object.values(studyResourceTypeEnum).includes(value)) {
        throw new Error("Invalid study resource type");
      }
      return true;
    })
    .withMessage("Invalid study resource type"),
  body("tagId").custom(async (value, { req }) => {
    if (value) {
      const existingTag = await tags.getTagById(value, req.user!.userId);
      if (!existingTag) {
        throw new Error("Tag not found");
      }
    }
    return true;
  }),
];

const validateGetSessions = [
  query("from").optional().isISO8601().withMessage("From must be a date"),
  query("to").optional().isISO8601().withMessage("To must be a date"),
  query("page")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("itemsOnPage")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
];

const router = Router();

router.get("/", requiredAuth, validate(validateGetSessions), getSessions);
router.post("/", requiredAuth, validate(validateCreateSession), createSession);
router.get("/:sessionId", requiredAuth, getSessionById);
router.patch(
  "/:sessionId",
  requiredAuth,
  validate(validateUpdateSession),
  updateSession
);
router.put("/:sessionId", requiredAuth, validate(validateCreateSession), replaceSession);
router.delete("/:sessionId", requiredAuth, deleteSession);
export default router;
