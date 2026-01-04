import { query } from "express-validator";

export const validateTimeRangeQuery = [
  query("from")
    .optional()
    .isISO8601()
    .withMessage("From field must be a date")
    .toDate(),
  query("to")
    .optional()
    .isISO8601()
    .withMessage("To field must be a date")
    .toDate(),
];
