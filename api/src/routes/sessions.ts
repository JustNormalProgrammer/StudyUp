import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import resources from "../db/queries/resources";
import {
  getSessions,
  getSessionById,
  createSession,
  deleteSession,
  replaceSession,
} from "../controllers/sessions";
import { body, query } from "express-validator";
import validate from "../utils/validate";
import { StudyResourceTypeEnum } from "../db/queries/resources";
import tags from "../db/queries/tags";

const validateCreateSession = [
  body("tagId").notEmpty().withMessage("Tag is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("notes").optional().notEmpty().withMessage("Notes cannot be empty"),
  body("startedAt")
    .notEmpty()
    .withMessage("Starting time is required")
    .isISO8601()
    .withMessage("Starting time must be a valid date")
    .toDate(),
  body("durationMinutes")
    .notEmpty()
    .withMessage("Duration minutes is required")
    .isInt({ min: 0 })
    .withMessage("Duration minutes must be a positive integer"),
  body("studyResources")
    .isArray()
    .withMessage("Study resources must be an array"),
  body("studyResources.*")
    .isUUID()
    .withMessage("Each resource must be a valid UUID"),
  body("studyResources.*").custom(async (value, { req }) => {
    try {
      const existingResource = await resources.getResourceById(
        value,
        req.user!.userId
      );
      if (!existingResource) {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      throw new Error("Resource not found");
    }
    return true;
  }),
  body("tagId").custom(async (value, { req }) => {
    if (value) {
      try {
        const existingTag = await tags.getTagById(value, req.user!.userId);
        if (!existingTag) {
          throw new Error();
        }
      } catch (error) {
        console.log(error);
        throw new Error("Tag not found");
      }
    }
    return true;
  }),
];

const validateUpdateSession = [
  body("tagId")
    .optional()
    .notEmpty()
    .withMessage("Tag is required")
    .bail()
    .custom(async (value, { req }) => {
      if (value) {
        const existingTag = await tags.getTagById(value, req.user!.userId);
        if (!existingTag) {
          throw new Error("Tag not found");
        }
      }
      return true;
    }),
  body("title").optional().notEmpty().withMessage("Title is required"),
  body("notes").optional().notEmpty().withMessage("Notes is required"),
  body("startedAt")
    .optional()
    .notEmpty()
    .withMessage("Starting time is required")
    .isISO8601()
    .withMessage("Starting time must be a valid date")
    .toDate(),
  body("durationMinutes")
    .optional()
    .notEmpty()
    .withMessage("Duration minutes is required")
    .isInt({ min: 0 })
    .withMessage("Duration minutes must be a positive integer"),
  body("studyResources").isArray().withMessage("Resources must be an array"),
  body("studyResources.*")
    .isUUID()
    .withMessage("Each resource must be a valid UUID"),
  body("studyResources.*").custom(async (value, { req }) => {
    try {
      const existingResource = await resources.getResourceById(
        value,
        req.user!.userId
      );
      if (!existingResource) {
        throw new Error();
      }
    } catch (error) {
      throw new Error("Resource not found");
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
/* router.patch(
  "/:sessionId",
  requiredAuth,
  validate(validateUpdateSession),
  updateSession
); */
router.put(
  "/:sessionId",
  requiredAuth,
  validate(validateCreateSession),
  replaceSession
); 
router.delete("/:sessionId", requiredAuth, deleteSession);
export default router;
