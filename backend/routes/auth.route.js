import express from "express";
import {
  getProfile,
  login,
  logout,
  refreshAccessToken,
  signup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/get-me", protectRoute, getProfile);

export default router;
