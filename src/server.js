const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");

const errorHandler = require("./middleware/errorHandler");

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`🚀 API listening on http://localhost:${PORT}`)
);
