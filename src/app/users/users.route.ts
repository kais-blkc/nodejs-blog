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
import { asyncHandler } from "@/core/utils/async-handler";

const router = Router();
const prisma = container.get<PrismaClient>(TYPES.PrismaClient);
const usersController = container.get<UsersController>(TYPES.UsersController);

router.get(
  "/",
  authMiddlewareFactory(prisma),
  adminMiddleware,
  asyncHandler(usersController.findAll),
);

router.get(
  "/:id",
  authMiddlewareFactory(prisma),
  selfOrAdminMiddleware,
  asyncHandler(usersController.findById),
);

router.patch(
  "/:id",
  authMiddlewareFactory(prisma),
  selfOrAdminMiddleware,
  validateDtoMiddleware(UserUpdateDto),
  asyncHandler(usersController.update),
);

router.patch(
  "/:id/role",
  authMiddlewareFactory(prisma),
  adminMiddleware,
  validateDtoMiddleware(UserUpdateRoleDto),
  asyncHandler(usersController.changeRole),
);

export { router as usersRouter };
