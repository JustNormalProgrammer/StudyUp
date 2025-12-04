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
import resources, { StudyResourceTypeEnum } from "../db/queries/resources";

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
  body("title").custom(async (value, { req }) => {
    let existingResource: { resourceId: string } | undefined = undefined;
    try {
      existingResource = await resources.getResourceByTitle(
        value,
        req.user!.userId
      );
    } catch (error) {
      console.log(error);
      throw new Error(
        "Failed to check if resource with this title already exists"
      );
    }
    if (existingResource) {
      throw new Error(`Title already in use`);
    }
    return true;
  }),
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
