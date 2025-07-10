import { StringValue } from "ms";
import env from "env-var";
import "dotenv/config";

export const envConfig = {
  port: env.get("PORT").default("3000").asString(),
  jwtSecret: env.get("JWT_SECRET").required().asString(),
  jwtExpiresIn: env.get("JWT_EXPIRES_IN").required().asString() as StringValue,
};
