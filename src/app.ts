import { errorMiddleware } from "@/core/middlewares/error.middleware";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { setupSwagger } from "./core/config/swagger.config";
import { setupRoutes } from "./routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", setupRoutes());
app.use(errorMiddleware);
setupSwagger(app);

export { app };
