import { AuthController } from "@/app/auth/auth.controller";
import { AuthService } from "@/app/auth/auth.service";
import { FilesController } from "@/app/files/files.controller";
import { FilesService } from "@/app/files/files.service";
import { UsersController } from "@/app/users/users.controller";
import { UsersService } from "@/app/users/users.service";
import { PrismaClient } from "@prisma/client";
import { Container } from "inversify";
import { prisma } from "../config/db.config";
import { TYPES } from "./types";

const container = new Container();

container
  .bind<PrismaClient>(TYPES.PrismaClient)
  .toConstantValue(prisma)
  .onDeactivation(async (db) => {
    console.log("Disconnecting from the database...");
    await db.$disconnect();
  });

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<UsersService>(TYPES.UsersService).to(UsersService);
container.bind<UsersController>(TYPES.UsersController).to(UsersController);
container.bind<FilesService>(TYPES.FilesService).to(FilesService);
container.bind<FilesController>(TYPES.FilesController).to(FilesController);

export { container };
