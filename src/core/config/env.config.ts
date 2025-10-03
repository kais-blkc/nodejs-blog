import "dotenv/config";
import env from "env-var";
import { StringValue } from "ms";

export const envConfig = {
  port: env.get("PORT").default("3000").asString(),
  jwtSecret: env.get("JWT_SECRET").required().asString(),
  jwtRefreshSecret: env.get("JWT_REFRESH_SECRET").required().asString(),
  jwtExpiresIn: env.get("JWT_EXPIRES_IN").required().asString() as StringValue,
  jwtRefreshExpiresIn: env
    .get("JWT_REFRESH_EXPIRES_IN")
    .required()
    .asString() as StringValue,
};
