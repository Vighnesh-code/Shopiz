import toast from "react-hot-toast";
import axios from "../lib/axios";
import { create } from "zustand";
import { get } from "mongoose";

export const useCartStore = create((set) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: 0,

  // Functions

  // Coupon Functions
  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      set({ coupons: response.data });
    } catch (error) {
      console.error("Error Fetching coupon: ", error);
    }
  },
  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  // Cart Functions
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      toast.success("Added To Cart!");
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  getCartItems: async () => {
    try {
      const response = await axios.get("/cart");
      set({ cart: response.data });
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "An error occured");
    }
  },
  updateQuantity: async (productId, quantity) => {
    try {
      if (quantity === 0) {
        get().removeFromCart(productId);
        return;
      }

      await axios.put(`/cart/${productId}`, { quantity });
      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));
    } catch (error) {
      console.log(
        "Error in useCartStore (updatequantity): ",
        error.response.data.message
      );
    }
  },
  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
    } catch (error) {
      console.log(
        "Error in removeFromCart (zustand store): ",
        error.response.data.message
      );
    }
  },
}));
