import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { genToken } from "../utils/genToken.js";
import { setCookies } from "../utils/setCookie.js";
import { storeRefreshToken } from "../utils/storeRefreshToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Please fill all credentials!" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already registered!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const { accessToken, refreshToken } = genToken(user._id, res);
    setCookies(accessToken, refreshToken, res);
    await storeRefreshToken(refreshToken, userId);

    res.status(201).json({
      success: true,
      message: "Account Created Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.log(`Error in signup Controller: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please, Provide all the credentials!",
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User Not Found!" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }
    const { accessToken, refreshToken } = genToken(user._id);
    setCookies(accessToken, refreshToken, res);
    await storeRefreshToken(refreshToken, user._id);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.log(`Error in login Controller: ${error.message}`);
  }
};

export const logout = async (req, res) => {
  try {
    res.send("Hey from logout Page");
  } catch (error) {
    console.log(`Error in logout Controller: ${error.message}`);
  }
};
