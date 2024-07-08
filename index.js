const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");

dotenv.config(); // Load config

const { verifyToken } = require("./middleware/auth.middleware");


async function main() {
  await connectDB();
  app.use(express.static("public"))
  app.use(express.json());
  app.use(cors({
      origin: ["http://localhost:5173", "http://localhost:5175"],
    }));
  
  const taskRoutes = require("./routes/task.route")
  const authRoutes = require("./routes/auth.route");

  app.use("/api/auth", authRoutes);
  app.use("/api/task", taskRoutes);
  
  app.listen(PORT, function (err) {
      if (err) console.log(err);
      console.log("Server listening on PORT", PORT);
  });
}

main();
 