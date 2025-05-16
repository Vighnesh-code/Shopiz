import express from "express";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommededProducts,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// Admin Routes
router.post("/create", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

// User Routes
router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/recommendations", protectRoute, getRecommededProducts);
router.get("/featured", protectRoute, getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);

export default router;
