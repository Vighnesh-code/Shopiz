import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(400).json({ message: "No Token Provided!" });

    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded)
      return res
        .status(403)
        .json({ message: "Unauthorized! Token Didn't match" });

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "No User Found!" });

    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in protectRoute Middleware: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(500).json({ message: "Access Denied - Admin Only" });
  }
};
