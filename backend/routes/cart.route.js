import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { addToCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", protectRoute, addToCart);

export default router;
