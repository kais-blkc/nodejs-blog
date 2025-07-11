import { validateDtoMiddleware } from "@/core/middlewares/validate-dto.middleware";
import { container } from "@/core/di/inversify.config";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { AuthController } from "./auth.controller";
import { TYPES } from "@/core/di/types";
import { Router } from "express";
import { asyncHandler } from "@/core/utils/async-handler";

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post(
  "/register",
  validateDtoMiddleware(RegisterDto),
  asyncHandler(authController.register),
);

router.post(
  // for break lines
  "/login",
  validateDtoMiddleware(LoginDto),
  asyncHandler(authController.login),
);

export { router as authRouter };
