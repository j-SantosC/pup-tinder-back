const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // sub: { type: String, required: true, unique: true }, // ID de Auth0
    name: String,
    email: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
