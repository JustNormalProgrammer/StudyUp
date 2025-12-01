import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import {
  createResource,
  deleteResource,
  getResourceById,
  getResources,
} from "../controllers/resources";
import validate from "../utils/validate";
import { body } from "express-validator";
import { StudyResourceTypeEnum } from "../db/queries/resources";

const validateCreateResource = [
  body("title").notEmpty().withMessage("Title is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("desc").optional().notEmpty().withMessage("Description is required"),
  body("type").custom((value) => {
    if (!Object.values(StudyResourceTypeEnum).includes(value)) {
      throw new Error("Invalid study resource type");
    }
    return true;
  }),
  body("url").optional().notEmpty().isURL().withMessage("URL is invalid"),
];

const router = Router();
router.get("/", requiredAuth, getResources);
router.get("/:resourceId", requiredAuth, getResourceById);
router.post(
  "/",
  requiredAuth,
  validate(validateCreateResource),
  createResource
);
router.delete("/:resourceId", requiredAuth, deleteResource);
export default router;
