// auth.middleware.js
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const cleanToken = token.replace('Bearer ', ''); // Remove 'Bearer ' prefix
    const decoded = jwt.verify(cleanToken, JWT_SECRET); // Verify token
    req.userId = decoded.userId; // Add userId to request object
    next(); // Call next middleware
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { verifyToken };
