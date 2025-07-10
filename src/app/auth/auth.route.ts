import { validateDtoMiddleware } from "@/core/middlewares/validate-dto.middleware";
import { container } from "@/core/di/inversify.config";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { AuthController } from "./auth.controller";
import { TYPES } from "@/core/di/types";
import { Router } from "express";

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post(
  "/register",
  validateDtoMiddleware(RegisterDto),
  authController.register,
);

router.post(
  // for break lines
  "/login",
  validateDtoMiddleware(LoginDto),
  authController.login,
);

export { router as authRouter };
