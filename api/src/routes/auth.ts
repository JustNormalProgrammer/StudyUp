import {
  handleLogin,
  handleLogout,
  handleRegister,
  handleRefreshToken,
} from "../controllers/auth";
import { Router } from "express";
import { body } from "express-validator";
import { requiredAuth } from "../middleware/requiredAuth";
import users from "../db/queries/users";
import { User } from "../types";
import validate from "../utils/validate";

const validateLogin = [
  body("email").trim().isEmail().withMessage("Invalid email address"),
  body("password")
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage("Password cannot be empty or exceed 256 characters"),
];
// Add min length
const validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Username cannot exceed 100 characters"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ max: 256 })
    .withMessage("Password cannot be empty or exceed 256 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Email cannot exceed 255 characters"),
  body("email").custom(async (email) => {
    let duplicate: User | null = null;
    try {
      duplicate = await users.getUserByEmail(email);
    } catch (e) {
        console.log(e);
      throw new Error("Failed to connect to the database. Cannot sign in.");
    }
    if (duplicate) throw new Error("Email already in use");
  }),
  body("username").custom(async (username) => {
    let duplicate: User | null = null;
    try {
      duplicate = await users.getUserByUsername(username);
    } catch (e) {
      throw new Error("Failed to connect to the database. Cannot sign in.");
    }
    if (duplicate) throw new Error("Username already in use");
  }),
];
const router = Router();

router.post("/login", validate(validateLogin), handleLogin);
router.post("/register", validate(validateRegister), handleRegister);
router.get("/logout", requiredAuth, handleLogout);
router.get("/refresh-token", handleRefreshToken);

export default router;
