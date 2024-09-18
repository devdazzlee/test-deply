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

  io.on("connection", socket => {
    console.log("A user connected", socket.id);

    // Listen for custom events
    socket.on("message", message => {
      console.log("Message received:", message);
      // Broadcast the message to all clients
      io.emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
});
