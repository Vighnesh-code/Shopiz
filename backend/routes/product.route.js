import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  getAllProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createProduct);
router.get("/", protectRoute, getAllProducts);
router.get("/featured", protectRoute, getFeaturedProducts);

export default router;
