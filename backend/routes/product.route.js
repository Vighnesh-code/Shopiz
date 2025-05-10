import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommededProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createProduct);
router.get("/", protectRoute, getAllProducts);
router.get("/recommendations", protectRoute, getRecommededProducts);
router.get("/featured", protectRoute, getFeaturedProducts);
router.get("/category/:category", protectRoute, getProductsByCategory);
router.delete("/:id", protectRoute, deleteProduct);

export default router;
