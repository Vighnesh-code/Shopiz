import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, createProduct);
router.get("/", protectRoute, getAllProducts);

export default router;
