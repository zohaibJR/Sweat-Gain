import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  requestSignupOtp,
  requestPasswordReset,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup/request-otp", requestSignupOtp);

// Signup route
router.post("/signup", signupUser);

// Login route
router.post("/login", loginUser);

router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

// Logout route
router.post("/logout", logoutUser);

export default router;
