const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    sub: { type: String, required: true, unique: true },
    name: String,
    email: String,
    bio: String,
    imageUrl: String,
    dogs: [dogSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
