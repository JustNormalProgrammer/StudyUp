import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import {
  createTag,
  deleteTag,
  getUserTags,
  updateTag,
} from "../controllers/tags";
import validate from "../utils/validate";
import { body } from "express-validator";

const validateTag = [
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Content must be between 1 and 50 characters"),
  body("color")
    .notEmpty()
    .withMessage("Color is required")
    .isHexColor()
    .withMessage("Color must be a valid hex color"),
];

const router = Router();

router.get("/", requiredAuth, getUserTags);
router.post("/", requiredAuth, validate(validateTag), createTag);
router.delete("/:tagId", requiredAuth, deleteTag);
router.put("/:tagId", requiredAuth, validate(validateTag), updateTag);
export default router;
