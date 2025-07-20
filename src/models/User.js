const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    sub: { type: String, required: true, unique: true },
    name: String,
    email: String,
    imageUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
