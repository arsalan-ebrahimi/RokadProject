import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  img: {
    type: String,
    required: [true, "وارد کردن تصویر مقاله الزامی است"],
  },
  title: {
    type: String,
    unique: true,
    required: [true, "وارد کردن عنوان مقاله الزامی است"],
  },
  date: {
    type: String,
    required: [true, "وارد کردن تاریخ مقاله الزامی است"],
  },
  description: {
    type: String,
    required: [true, "نوشتن توضیحات مقاله الزامی است"],
  },
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;