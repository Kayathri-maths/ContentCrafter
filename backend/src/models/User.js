import mongoose from "mongoose";

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

export const User = mongoose.model("User", UserSchema);
