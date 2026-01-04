import { query } from "express-validator";

export const validatePaginationQuery = [
  query("start")
    .optional()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Start field must be a positive integer"),
  query("limit")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Limit field must be a positive integer"),
];
