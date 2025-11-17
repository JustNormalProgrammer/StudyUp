import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import { getMe } from "../controllers/users";
import sessions from "../routes/sessions";
import tags from "../routes/tags";

const router = Router();

router.get("/me", requiredAuth, getMe);


export default router;
