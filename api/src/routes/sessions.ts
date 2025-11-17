import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import { createSession, getSessionById, getSessions } from "../controllers/sessions";
import { body, query } from "express-validator";
import validate from "../utils/validate";
import { studyResourceTypeEnum } from "../db/queries/sessions";

const validateCreateSession = [
  body("tagId").notEmpty().withMessage("Tag is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("notes").optional().notEmpty().withMessage("Notes cannot be empty"),
  body("startedAt").notEmpty().withMessage("Starting time is required"),
  body("durationMinutes").notEmpty().withMessage("Duration minutes is required").isInt({ min: 0 }).withMessage("Duration minutes must be a positive integer"),
  body("studyResources").isArray().withMessage("Study resources must be an array"),
  body("studyResources.*.title").trim().notEmpty().withMessage("Resource title is required"),
  body("studyResources.*.type").trim().notEmpty().withMessage("Resource type is required"),
  body("studyResources.*.content").optional().trim().notEmpty().withMessage("Resource content cannot be empty"),
  body("studyResources.*.type").custom((value) => {
    if (!Object.values(studyResourceTypeEnum).includes(value)) {
      throw new Error("Invalid resource type");
    }
    return true;
  }).withMessage("Invalid resource type"),
];
const validateGetSessions = [
  query("from").optional().isISO8601().withMessage("From must be a date"),
  query("to").optional().isISO8601().withMessage("To must be a date"),
  query("page").optional().toInt().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("itemsOnPage").optional().toInt().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
];

const router = Router();

router.get("/", requiredAuth, validate(validateGetSessions), getSessions);
router.post("/", requiredAuth, validate(validateCreateSession), createSession);
router.get("/:sessionId", requiredAuth, getSessionById);
export default router;
