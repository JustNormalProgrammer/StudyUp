import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import { getUserTags } from "../controllers/tags";

const router = Router();

router.get('/', requiredAuth, getUserTags);

export default router;  