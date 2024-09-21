const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    // Broadcast the received frame to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("Listening on port 3000!");
});

app.get("/", (req, res) => {
  const { param1 } = req.query;

  res.send("Hello World!<br>Param1 = " + param1);
});

app.get("/live", (req, res) => {
  res.render("broadcast");
});
