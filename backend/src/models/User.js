const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    avatar: { type: String },
    roles: { type: [String], default: [] }, // ['admin']
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = { User };
