import { query } from "express-validator";

export const validatePaginationQuery = [
  query("from").optional().isISO8601().withMessage("From field must be a date").toDate(),
  query("to").optional().isISO8601().withMessage("To field must be a date").toDate(),
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
