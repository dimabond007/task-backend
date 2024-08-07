const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");

dotenv.config(); // Load config

const { verifyToken } = require("./middleware/auth.middleware");


async function main() {
  await connectDB();

  app.use(express.static("public"))
  app.use(express.json());
  app.use(cors());
  
  const taskRoutes = require("./routes/task.route")
  const authRoutes = require("./routes/auth.route");

  app.use("/api/auth", authRoutes);
  app.use("/api/task", taskRoutes);
  
  // Catch-all route
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  app.listen(PORT, function (err) {
      if (err) console.log(err);
      console.log("Server listening on PORT", PORT);
  });
}

main();
 