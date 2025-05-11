import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { addToCart, getCartProducts } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", protectRoute, addToCart);
router.get("/", protectRoute, getCartProducts);

export default router;
