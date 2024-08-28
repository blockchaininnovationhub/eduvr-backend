import express from "express";
import SignupController from "./controllers/SignupController.js";
import LoginController from "./controllers/LoginController.js";
import db from "./db.js";
import config from "./config.js";
import {
  GetCallController,
  MyCallController,
  CallStatController,
  CreateCallController,
} from "./controllers/CallController.js";
import RefreshAccessTokenController from "./controllers/RefreshAccessTokenController.js";
import AuthMiddleware from "./middlewares/AuthMiddleware.js";
import cors from "cors";
import CreateCallParticipant from "./controllers/CallParticipantController.js";
import GetAvailablePositions from "./controllers/AvailablePositionController.js";
import ProfileController from "./controllers/ProfileController.js";

const start = async () => {
  await db();

  const app = express();
  const PORT = process.env.PORT || 9000;

  app.use(express.json());
  app.use(cors());

  app.post("/auth/login", LoginController);
  app.post("/auth/signup", SignupController);
  app.post("/auth/token/refresh", RefreshAccessTokenController);
  app.get("/auth/profile", AuthMiddleware, ProfileController);

  app.get("/call/stats", AuthMiddleware, CallStatController);
  app.get("/call/:id", GetCallController);
  app.get("/call", AuthMiddleware, MyCallController);
  app.post("/call", AuthMiddleware, CreateCallController);
  app.post("/call/join", CreateCallParticipant);
  app.get("/call/positions/:callId", AuthMiddleware, GetAvailablePositions);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(process.env.NODE_ENV);
  });
};

config(start);
