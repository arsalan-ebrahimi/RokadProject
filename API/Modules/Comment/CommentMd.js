import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, "Author name is required"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Comment content is required"],
  },
  role: {
    type: String,
    required: [true, "Author role is required"],
    enum: {
      values: ["دانش آموز", "اولیا", "معلم"],
      message: "Role must be either: student, parent, or teacher",
    },
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: {
      values: ["مرد", "زن"],
      message: "Gender must be either male or female",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment =new mongoose.model("Comment", commentSchema);

export default Comment;