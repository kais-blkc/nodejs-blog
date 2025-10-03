import { Router } from "express";
import { authRouter } from "./app/auth/auth.route";
import { filesRouter } from "./app/files/files.route";
import { usersRouter } from "./app/users/users.route";

export const setupRoutes = (): Router => {
  const router = Router();

  router.use("/auth", authRouter);
  router.use("/users", usersRouter);
  router.use("/files", filesRouter);

  return router;
};
