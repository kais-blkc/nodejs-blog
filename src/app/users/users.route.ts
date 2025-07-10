import { validateDtoMiddleware } from "@/core/middlewares/validate-dto.middleware";
import { UserUpdateDto, UserUpdateRoleDto } from "../users/dto/users.dto";
import { UsersController } from "../users/users.controller";
import { container } from "@/core/di/inversify.config";
import { PrismaClient } from "@prisma/client";
import {
  authMiddlewareFactory,
  selfOrAdminMiddleware,
  adminMiddleware,
} from "@/core/middlewares/auth.middleware";
import { TYPES } from "@/core/di/types";
import { Router } from "express";

const router = Router();
const prisma = container.get<PrismaClient>(TYPES.PrismaClient);
const usersController = container.get<UsersController>(TYPES.UsersController);

router.get(
  "/",
  authMiddlewareFactory(prisma),
  adminMiddleware,
  usersController.findAll,
);

router.get(
  "/:id",
  authMiddlewareFactory(prisma),
  selfOrAdminMiddleware,
  usersController.findById,
);

router.patch(
  "/:id",
  authMiddlewareFactory(prisma),
  selfOrAdminMiddleware,
  validateDtoMiddleware(UserUpdateDto),
  usersController.update,
);

router.patch(
  "/:id/role",
  authMiddlewareFactory(prisma),
  adminMiddleware,
  validateDtoMiddleware(UserUpdateRoleDto),
  usersController.changeRole,
);

export { router as usersRouter };
