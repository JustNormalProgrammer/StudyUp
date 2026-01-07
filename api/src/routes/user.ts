import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import {
  getUserEvents,
  getUserDetails,
  getUserStats,
  updateUserSettings,
  getUserBarChartDurationData,
  getTodaysUserProgressChartData,
  getUserSettings,
} from "../controllers/user";
import { validatePaginationQuery } from "../utils/validatePagination";
import validate from "../utils/validate";
import { body } from "express-validator";
import { validateTimeRangeQuery } from "../utils/validateTimeRange";

const router = Router();

const updateUserSettingsSchema = [
  body("dailyStudyGoal")
    .isInt({ min: 1}),
  body("weeklyQuizGoal")
    .isInt({ min: 1 }),
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
  "/chart-data/sessions-duration",
  requiredAuth,
  validate(validateTimeRangeQuery),
  getUserBarChartDurationData
);
router.get(
  "/chart-data/progress",
  requiredAuth,
  getTodaysUserProgressChartData
);

router.get("/settings", requiredAuth, getUserSettings);
router.put("/settings", requiredAuth, validate(updateUserSettingsSchema), updateUserSettings);
export default router;
