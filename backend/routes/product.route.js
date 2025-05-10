import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createProduct);
router.get("/", protectRoute, getAllProducts);
router.get("/featured", protectRoute, getFeaturedProducts);
router.delete("/:id", protectRoute, deleteProduct);

export default router;
