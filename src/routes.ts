import { usersRouter } from "./app/users/users.route";
import { authRouter } from "./app/auth/auth.route";
import { app } from "./app";
import { Router } from "express";

export const setupRoutes = (): Router => {
  const router = Router();

  router.use("/auth", authRouter);
  router.use("/users", usersRouter);

  return router;
};
