"use strict";
// 3rd Party Resources
require("dotenv").config();
const port = process.env.PORT ;
// const port2 = process.env.PORT2 || 3001;

//--------------------------

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./auth/routes");
const v2Routes = require("./routes/v2.js");
const notFoundHandler = require("./error-handlers/404.js");
const errorHandler = require("./error-handlers/500.js");
// const logger = require("./middleware/logger.js");
const v1Routes = require("./routes/v1.js");
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
//_______---
const io = new Server(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
  }
});

// const socket = require("socket.io");
// const io = socket(port);

io.on("connection", (newSocket) => {
  console.log("connected to clienttttttttttttttttttttttttttttttttttttttttt", newSocket.id);
  newSocket.on('send_message', (data) => {
    console.log("Received message from client:", data.message);
    // If you want to send the message back to the client, you can emit a "receive_message" event:
    io.emit("receive_message", { message: data.message });
  });
});

//--------------------------
app.use(express.json());
// app.use(logger);
app.use("/api/v1", v1Routes);
app.use("/api/v2", v2Routes);
app.use(authRoutes);
app.get("/", welcomeHandler);
function welcomeHandler(req, res) {
  res.status(200).send("hello home");
}
app.use("*", notFoundHandler);
app.use(errorHandler);
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

module.exports = {
  // server: app,
  start: (port) => {
    server.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
