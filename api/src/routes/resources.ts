import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import {
  createResource,
  deleteResource,
  getResourceById,
  getResources,
  replaceResource,
} from "../controllers/resources";
import validate from "../utils/validate";
import { body, query } from "express-validator";
import { StudyResourceTypeEnum } from "../db/queries/resources";
import { validatePaginationQuery } from "../utils/validatePagination";
const validateResource = [
  body("title").notEmpty().withMessage("Title is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters"),
  body("type").notEmpty().withMessage("Type is required"),
  body("desc").optional().notEmpty().withMessage("Description is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Description must be between 1 and 255 characters"),
  body("type").custom((value) => {
    if (!Object.values(StudyResourceTypeEnum).includes(value)) {
      throw new Error("Invalid study resource type");
    }
    return true;
  }),
  body("url").optional().notEmpty().isURL().withMessage("URL is invalid"),
];

const router = Router();
router.get(
  "/",
  requiredAuth,
  validate(validatePaginationQuery),
  query("q").optional().isString().withMessage("Search must be a string"),
  query("type").optional().isIn(Object.values(StudyResourceTypeEnum)).withMessage("Invalid study resource type"),
  getResources
);
router.get("/:resourceId", requiredAuth, getResourceById);
router.post("/", requiredAuth, validate(validateResource), createResource);
router.put(
  "/:resourceId",
  requiredAuth,
  validate(validateResource),
  replaceResource
);
router.delete("/:resourceId", requiredAuth, deleteResource);
export default router;
