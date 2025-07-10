import { container } from "./core/di/inversify.config";
import { connectDB } from "./core/config/db.config";
import { envConfig } from "./core/config/env.config";
import { app } from "./app";

async function bootstrap() {
  connectDB();

  const Port = envConfig.port;

  const server = app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
  });

  process.on("SIGINT", async () => {
    await container.unbindAll();
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
