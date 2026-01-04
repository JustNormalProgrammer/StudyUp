import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import {
  getUserEvents,
  getUserDetails,
  getUserStats,
  updateUserSettings,
  getUserChartData,
  getUserSettings,
} from "../controllers/user";
import { validatePaginationQuery } from "../utils/validatePagination";
import validate from "../utils/validate";
import { body, query } from "express-validator";

const router = Router();

const updateUserSettingsSchema = [
  body("dailyStudyGoal")
    .isInt({ min: 1}),
  body("weeklyQuizGoal")
    .isInt({ min: 1 }),
];
const getUserChartDataSchema = [
  query("from").isISO8601().withMessage("From field must be a date").toDate(),
  query("to").isISO8601().withMessage("To field must be a date").toDate(),
  query("goal").optional().isBoolean(),
];
router.get("/details", requiredAuth, getUserDetails);
router.get(
  "/events",
  requiredAuth,
  validate(validatePaginationQuery),
  getUserEvents
);
router.get("/stats", requiredAuth, getUserStats);
router.get(
  "/chart-data",
  requiredAuth,
  validate(getUserChartDataSchema),
  getUserChartData
);
router.get("/settings", requiredAuth, getUserSettings);
router.put("/settings", requiredAuth, validate(updateUserSettingsSchema), updateUserSettings);
export default router;
