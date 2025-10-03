import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export function setupSwagger(app: Express) {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "ERP Aero Test API",
        version: "1.0.0",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      { name: "Auth", description: "API для работы с авторизацией" },
      { name: "Users", description: "API для работы с пользователями" },
      { name: "Files", description: "API для работы с файлами" },
    ],
    apis: ["./src/app/**/*.route.ts"],
  };

  const swaggerSpec = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
