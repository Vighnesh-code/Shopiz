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

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products)
      return res.status(404).json({ message: "No Products Found!" });

    res.status(200).json(products);
  } catch (error) {
    console.log(`Error in getAllProducts controller: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
