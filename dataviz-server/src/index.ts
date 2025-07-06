import "reflect-metadata";
import http from "http";

import express from "express";
import cookieSession from "cookie-session";

import cors from "cors";
import { envConfig } from "./config/env.config";
import { AppDataSource } from "./database/data-sourcee";

async function bootstrap() {
  const app = express();

  const httpServer: http.Server = new http.Server(app);

  app.set("trust proxy", 1);
  app.use(
    cookieSession({
      name: "session",
      keys: [envConfig.SECRET_KEY_ONE, envConfig.SECRET_KEY_TWO],
      maxAge: 24 * 7 * 360000,
    })
  );

  const corsOptions = {
    origin: [envConfig.REACT_URL, envConfig.ANGULAR_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  };
  app.use(cors(corsOptions));

  try {
    httpServer.listen(envConfig.PORT, () => {
      console.log(`Server is running on http://localhost:${envConfig.PORT}`);
    });
  } catch (error) {
    console.error("Error during bootstrap:", error);
  }
}

AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established successfully.");
    bootstrap().catch(console.error);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
