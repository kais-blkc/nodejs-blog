import { envConfig } from "@/core/config/env.config";
import jwt from "jsonwebtoken";

export function generateJwt(
  userId: string,
  email: string,
  role: string = "USER",
) {
  return jwt.sign({ id: userId, email, role }, envConfig.jwtSecret, {
    expiresIn: envConfig.jwtExpiresIn,
  });
}
