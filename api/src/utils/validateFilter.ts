import { query } from "express-validator";

export const validateFilterQuery = [
  query("tagId").optional().isUUID().withMessage("TagId must be a valid UUID"),
  query("q").optional().isString().withMessage("Search must be a string"),
];
