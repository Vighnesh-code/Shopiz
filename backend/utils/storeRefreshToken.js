import { redis } from "../lib/redis.js";

export const storeRefreshToken = async (refreshToken, userId) => {
  await redis.set(
    `refreshToken: ${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};
