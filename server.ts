import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import next from "next";
import { NextApiRequest, NextApiResponse } from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new SocketIOServer(server);

  // Data structure to keep track of online users
  let onlineUsers: { [userId: string]: string } = {};

  // Data structure to keep track of rooms and their participants
  let rooms: { [roomId: string]: Set<string> } = {};

  io.on("connection", socket => {
    const userId = socket.handshake.query.userId as string;

    if (userId) {
      onlineUsers[userId] = socket.id;
      console.log(`User connected: ${userId}`);
      io.emit("updateOnlineStatus", userId, true);
    }

    // Handle room creation
    socket.on("createRoom", ({ roomId, participants }) => {
      console.log(`Room created: ${roomId}, Participants: ${participants}`);
      rooms[roomId] = new Set(participants);
    });

    // Handle incoming messages
    socket.on("message", ({ roomId, message }) => {
      console.log("Message received:", message);

      const receiverSocketId = onlineUsers[message.receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message", { roomId, message });
      }
    });

    // Handle room deletion
    socket.on("deleteRoom", (roomId: string) => {
      console.log(`Room deletion requested: ${roomId}`);

      if (rooms[roomId]) {
        rooms[roomId].forEach(userId => {
          const userSocketId = onlineUsers[userId];
          if (userSocketId) {
            io.to(userSocketId).emit("roomDeleted", roomId);
          }
        });

        // Remove the room from our rooms structure
        delete rooms[roomId];
      }
    });

    socket.on("disconnect", () => {
      if (userId) {
        console.log(`User disconnected: ${userId}`);
        delete onlineUsers[userId];
        io.emit("updateOnlineStatus", userId, false);
      }
    });

    socket.on(
      "checkUserOnline",
      (userId: string, callback: (isOnline: boolean) => void) => {
        const isOnline = !!onlineUsers[userId];
        callback(isOnline);
      }
    );
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
});
