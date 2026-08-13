import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    default: "",
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [
      /^(\+98|0)?9\d{9}$/,
      "Please enter a valid Iranian phone number",
    ],
  },
  password: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "superAdmin"],
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);
export default User;