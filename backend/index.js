const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const bodyParser = require("body-parser");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://hasala2002:laXhfmG8NSqXM1JT@hackrice14.f3sxe.mongodb.net/?retryWrites=true&w=majority&appName=HackRice14";

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    credentials: true, // If you need to send cookies or authentication tokens
  })
);

client.connect().then(() => {
  const db = client.db("classroom");
  const studentsCollection = db.collection("students");

  // POST route to create a new student
  app.post("/students", async (req, res) => {
    try {
      const { name, id, email } = req.body;
      console.log(name, id, email);
      // Validate the input
      if (!name || !id || !email) {
        return res
          .status(400)
          .json({ error: "Name, ID, and email are required" });
      }

      // Check if a student with the same ID already exists
      const existingStudent = await studentsCollection.findOne({ id });
      if (existingStudent) {
        return res
          .status(409)
          .json({ error: "Student with this ID already exists" });
      }

      // Insert the new student document
      const result = await studentsCollection.insertOne({ name, id, email });
      res.status(201).json({
        message: "Student created successfully",
        studentId: result.insertedId,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the student" });
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("stream", (image) => {
      socket.broadcast.emit("stream", image);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  app.get("/broadcast", (req, res) => {
    res.render("broadcast");
  });

  app.get("/", (req, res) => {
    run().catch(console.dir);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
