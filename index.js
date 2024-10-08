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
  DeactivateCallController,
  GetCallParticipants,
} from "./controllers/CallController.js";
import RefreshAccessTokenController from "./controllers/RefreshAccessTokenController.js";
import AuthMiddleware from "./middlewares/AuthMiddleware.js";
import cors from "cors";
import CreateCallParticipant from "./controllers/CallParticipantController.js";
import GetAvailablePositions from "./controllers/AvailablePositionController.js";
import ProfileController from "./controllers/ProfileController.js";
import CreateCallParticipantSocket from "./socket/CreateCallParticipantSocket.js";
import { Server } from "socket.io";
import { createServer } from "http";
import CallParticipantModel from "./models/CallParticipant.js";

const start = async () => {
  await db();

  const app = express();
  const PORT = process.env.PORT || 9000;

  const server = createServer(app);

  const io = new Server(server, {
    transports: ["websocket"],
  });

  app.use(express.json());
  app.use(cors());
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "i am alive!" });
  });

  app.post("/auth/login", LoginController);
  app.post("/auth/signup", SignupController);
  app.post("/auth/token/refresh", RefreshAccessTokenController);
  app.get("/auth/profile", AuthMiddleware, ProfileController);

  app.get("/call/stats", AuthMiddleware, CallStatController);
  app.get("/call/:id", GetCallController);
  app.get("/call", AuthMiddleware, MyCallController);
  app.post("/call", AuthMiddleware, CreateCallController);
  app.post("/call/participant", (req, res) =>
    CreateCallParticipant(req, res, io)
  );
  app.get("/call/participant/:callId", GetCallParticipants);
  app.get("/call/positions/:callId", GetAvailablePositions);
  app.post(
    "/call/deactivate/:callId",
    AuthMiddleware,
    DeactivateCallController
  );

  io.on("connection", (socket) => {
    socket.emit("connect", { message: "a new client connected" });

    socket.on("joinCall", (data) => {
      const result = CreateCallParticipantSocket(data, socket);

      io.emit("participantJoined", {
        result,
        message: "A new participant has joined the call",
      });
    });

    socket.on("disconnect", async () => {
      const socketSesssion = socket.id;
      const callParticipant = await CallParticipantModel.findOne({
        socketSesssion,
      });

      io.emit("participantLeft", {
        callParticipant,
        message: "A participant has left the call",
      });
    });
  });

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(process.env.NODE_ENV);
  });
};

config(start);
