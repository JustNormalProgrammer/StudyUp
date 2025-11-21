import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import { getUserEvents, getUserDetails } from "../controllers/user";

const router = Router();

router.get("/user-details", requiredAuth, getUserDetails);
router.get("/user-events", requiredAuth, getUserEvents);    
export default router;