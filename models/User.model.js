const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" ,default:[]}]
});

const User = mongoose.model("User", userSchema);

module.exports = User;