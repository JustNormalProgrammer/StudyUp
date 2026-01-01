import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import { getUserEvents, getUserDetails, getUserEventsChart } from "../controllers/user";
import { validatePaginationQuery } from "../utils/validatePagination";
import validate from "../utils/validate";

const router = Router();

router.get("/user-details", requiredAuth, getUserDetails);
router.get(
  "/user-events",
  requiredAuth,
  validate(validatePaginationQuery),
  getUserEvents
);
router.get(
  "/user-events/chart",
  requiredAuth,
  validate(validatePaginationQuery),
  getUserEventsChart
);
export default router;
