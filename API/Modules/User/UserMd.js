import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    default: "",
  },
  phoneNumber: {
    type: String,
    required: [true, "وارد کردن شماره موبایل الزامی است"],
    trim: true,
    unique: true,
    match: [
      /^(\+98|0)?9\d{9}$/,
      "فرمت شماره موبایل نامعتبر است",
    ],
  },
  password: {
    type: String,
    trim: true,
  },
  birthDate: {
    type: String,
    trim: true,
    default: "",
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin", "superAdmin"],
      message: "نقش کاربر نامعتبر است"
    },
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);
export default User;