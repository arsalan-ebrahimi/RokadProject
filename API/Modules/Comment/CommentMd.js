import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, "وارد کردن نام نویسنده الزامی است"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "وارد کردن متن نظر الزامی است"],
  },
  role: {
    type: String,
    required: [true, "وارد کردن نقش الزامی است"],
  },
  img: {
    type: String,
    required: [true, "ارسال تصویر یا آیکون الزامی است"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;