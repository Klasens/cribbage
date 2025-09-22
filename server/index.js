const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { registerSocket } = require("./socketHandlers");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// Serve built client in prod
app.use(express.static(path.join(__dirname, "../client/dist")));

registerSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
