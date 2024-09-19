import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import next from "next";
import { NextApiRequest, NextApiResponse } from "next";

// Setting up the Next.js application
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req: NextApiRequest, res: NextApiResponse) => {
    handle(req, res);
  });

  // Initialize Socket.IO server
  const io = new SocketIOServer(server);

  // Data structure to keep track of online users
  let onlineUsers: { [userId: string]: string } = {};

  io.on("connection", socket => {
    const userId = socket.handshake.query.userId as string;

    // Add the connected user to the onlineUsers list
    if (userId) {
      onlineUsers[userId] = socket.id;
      console.log(`User connected: ${userId}`);

      // Emit the online status to all clients
      io.emit("updateOnlineStatus", userId, true);
    }

    // Handle incoming messages
    socket.on("message", ({ roomId, message }) => {
      console.log("Message received:", message);

      // Emit the message to the specific user if they are online
      const receiverSocketId = onlineUsers[message.receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message", {
          roomId,
          message
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      if (userId) {
        console.log(`User disconnected: ${userId}`);

        // Remove the user from the onlineUsers list
        delete onlineUsers[userId];

        // Optionally broadcast the updated online users list
        io.emit("updateOnlineStatus", userId, false);
      }
    });

    // Custom event to check if a user is online
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
