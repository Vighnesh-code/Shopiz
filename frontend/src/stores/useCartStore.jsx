import toast from "react-hot-toast";
import axios from "../lib/axios";
import { create } from "zustand";

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
        existingItem
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
}));
