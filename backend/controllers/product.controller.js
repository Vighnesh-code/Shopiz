import { Product } from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ message: "Please fill all the fields." });
    }

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.log(`Error in createProduct Controller: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
