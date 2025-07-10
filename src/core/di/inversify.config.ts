import { UsersController } from "@/app/users/users.controller";
import { AuthController } from "@/app/auth/auth.controller";
import { UsersService } from "@/app/users/users.service";
import { AuthService } from "@/app/auth/auth.service";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../config/db.config";
import { Container } from "inversify";
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

export { container };
