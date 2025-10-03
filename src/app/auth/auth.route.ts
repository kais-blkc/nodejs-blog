import { validateDtoMiddleware } from "@/core/middlewares/validate-dto.middleware";
import { container } from "@/core/di/inversify.config";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { AuthController } from "./auth.controller";
import { TYPES } from "@/core/di/types";
import { Router } from "express";
import { asyncHandler } from "@/core/utils/async-handler";
import { JwtRefreshDto } from "./dto/jwt-refresh.dto";

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     tags: [Auth]
 *     summary: Вход в систему
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 */
router.post(
  "/signin",
  validateDtoMiddleware(LoginDto),
  asyncHandler(authController.login),
);

/**
 * @swagger
 * /api/auth/signin/new_token:
 *   post:
 *     tags: [Auth]
 *     summary: Обновление токенов
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
router.post(
  "/signin/new_token",
  validateDtoMiddleware(JwtRefreshDto),
  asyncHandler(authController.refreshToken),
);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Регистрация пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 */
router.post(
  "/signup",
  validateDtoMiddleware(RegisterDto),
  asyncHandler(authController.register),
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Выход из системы
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
router.post(
  "/logout",
  validateDtoMiddleware(JwtRefreshDto),
  asyncHandler(authController.logout),
);

export { router as authRouter };
