import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { genToken } from "../utils/genToken.js";
import { setCookies } from "../utils/setCookie.js";

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

    const newUser = await user.save();

    const { accessToken, refreshToken } = genToken(newUser._id, res);
    setCookies(accessToken, refreshToken, res);

    res.status(201).json({
      success: true,
      message: "Account Created Successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(`Error in signup Controller: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const login = async (req, res) => {
  try {
    res.send("Hey from login Page");
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
