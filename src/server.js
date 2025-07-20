// server.js
const express = require("express");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
})();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

app.get("/api/users", async (req, res, next) => {
  try {
    const users = await User.find();
    console.log("📦 Users found:", users);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res
      .status(401)
      .json({ valid: false, error: "Token inválido o faltante" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () =>
  console.log(`🚀 API listening on http://localhost:${PORT}`)
);
