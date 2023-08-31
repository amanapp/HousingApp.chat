import { Server } from "socket.io";
import express, { Request, Response } from "express";
import http from "http";
import ChatModel from "./model/chat.model";
import { connection } from "./model/dbconnection";
import path from "path";
import { logger } from "./middleware/winsdon.middleware";
import "./config/env";
import user from './routes/get_connected_user.routes'
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
// Serve the chat application
app.use("/chat", express.static(path.join(process.cwd(), "/public")));

app.use(user);

// Socket is connected
io.on("connection", (socket) => {
  logger.log({ level: "info", message: "Connected..." });

  socket.on("new-user-connect", (name) => {
    logger.log("username", name);
  });

  socket.on("message", async (msg) => {
    socket.broadcast.emit("message", msg);
    // Store the message in the database
    await ChatModel.updateOne(
      {
        $or: [{ sender_name: msg.user }, { receiver_name: msg.user }],
      },
      { $push: { message: msg } }
    );
  });

  const getChatHistory = async (sender, receiver) => {
    const chatHistory = await ChatModel.find({
      $or: [
        { sender_name: sender, receiver_name: receiver },
        { sender_name: receiver, receiver_name: sender },
      ],
    });

    socket.emit("chat-history", chatHistory);
  };

  // Post API used to start a chat
  app.post("/start-chat", async (req: Request, res: Response) => {
    const { sender, receiver } = req.body;

    const existingChat = await ChatModel.findOne({
      $or: [
        { sender_name: sender, receiver_name: receiver },
        { sender_name: receiver, receiver_name: sender },
      ],
    });

    if (existingChat) {
      // Chat already exists, get chat history

      getChatHistory(sender, receiver);
    } else {
      // Create a new chat room
      const room = `${sender}Room${receiver}`;
      await ChatModel.create({
        sender_name: sender,
        receiver_name: receiver,
        room_id: room,
      });
      // Get chat history for the new chat room
      getChatHistory(sender, receiver);
    }
  });
});
const port = process.env.PORT || 3003;
server.listen(port, () => {
  connection();
  logger.log({ level: "info", message: `server is running in ${port}` });
});
