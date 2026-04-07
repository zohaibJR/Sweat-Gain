import express from "express";
import { signupUser, loginUser, logoutUser } from "../controllers/userController.js";

const router = express.Router();

// Signup route
router.post("/signup", signupUser);

// Login route
router.post("/login", loginUser);

// Logout route
router.post("/logout", logoutUser);

export default router;
