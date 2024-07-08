const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const SALT_ROUNDS = 10; // Number of rounds to generate salt. 10 is recommended value

async function register(req, res) {
  console.log("register");
  try {
    const { username, email, firstname, lastname, password, profileImage } = req.body;
    console.log(username, email, firstname, lastname, password, profileImage);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS); // Hash password
    const user = new User({
      username,
      email,
      firstname,
      lastname,
      password: hashedPassword,
      profileImage
    }); // Create new user object
    await user.save(); // Save user to database

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("register", error.message);
    if (error.code === 11000) {
      console.log("username or email already exists");
      return res.status(400).json({ error: "User already exists" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    console.log(JWT_SECRET);
    // Generate JWT token containing user id
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send token in response to the client, not the user object!
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
}


async function getUser(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Authentication failed" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(data.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Authentication failed" });
  }
}

async function verifyToken(req, res, next){
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      const data = jwt.verify(token, JWT_SECRET);
      req.user = data.userId; // Store user id in request object
      next();
    } catch (error) {
      res.status(401).json({ error: "Authentication failed" });
    }
}


module.exports = { register, login, getUser };