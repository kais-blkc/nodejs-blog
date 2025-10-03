import { validateDtoMiddleware } from "@/core/middlewares/validate-dto.middleware";
import { UserUpdateDto, UserUpdateRoleDto } from "../users/dto/users.dto";
import { UsersController } from "../users/users.controller";
import { container } from "@/core/di/inversify.config";
import { TYPES } from "@/core/di/types";
import { Router } from "express";
import { asyncHandler } from "@/core/utils/async-handler";

const router = Router();
const usersController = container.get<UsersController>(TYPES.UsersController);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Получить всех пользователей
 *     responses:
 *       200:
 *         description: Список пользователей
 */
router.get("/", asyncHandler(usersController.findAll));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Найти пользователя по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Данные пользователя
 */
router.get("/:id", asyncHandler(usersController.findById));

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Обновить пользователя
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Иван Иванов"
 *               email:
 *                 type: string
 *                 example: "ivan@example.com"
 *     responses:
 *       200:
 *         description: Пользователь обновлен
 */
router.patch(
  "/:id",
  validateDtoMiddleware(UserUpdateDto),
  asyncHandler(usersController.update),
);

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     tags: [Users]
 *     summary: Изменить роль пользователя
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Роль изменена
 */
router.patch(
  "/:id/role",
  validateDtoMiddleware(UserUpdateRoleDto),
  asyncHandler(usersController.changeRole),
);

export { router as usersRouter };
