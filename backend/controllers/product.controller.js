import { Product } from "../models/product.model.js";
import { redis } from "../lib/redis.js";

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

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get(`featured_products`);
    if (featuredProducts) return res.json(JSON.parse(featuredProducts));

    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts)
      return res.status(404).json({ message: "No Featured Products Found!" });

    await redis.set(`featured_products`, JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    console.log(`Error in getFeaturedProducts: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "No Product Found!" });

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log(`deleted image from cloudinary`);
      } catch (error) {
        console.log(`Error deleting image from cloudinary, ${error.message}`);
      }
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: "Product Deleted Successfully!" });
  } catch (error) {
    console.log(`Error in deleteProduct: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRecommededProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log(`Error in getRecommededProducts: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
