import express from "express";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";

const wsServer = new WebSocketServer({ noServer: true });

wsServer.on("connection", (socket) => {
  socket.on("message", (message) => console.log("messaged!"));
});

dotenv.config();

const app = express();
const port = process.env.PORT;

const server = app.listen(port);
server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});
