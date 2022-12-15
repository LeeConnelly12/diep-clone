import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import http from "http";

const wsServer = new WebSocketServer({ noServer: true });

wsServer.on("connection", (socket) => {
  socket.on("message", (message) => console.log("messaged!"));
});

dotenv.config();

const server = http.createServer();

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});

server.listen(process.env.PORT);
