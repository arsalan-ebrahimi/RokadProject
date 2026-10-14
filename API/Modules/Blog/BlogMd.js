import mongoose from "mongoose";

const tableOfContentItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "وارد کردن عنوان سربرگ فهرست مطالب الزامی است"],
      trim: true,
    },
  },
  { _id: true }
);

const blogSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: [true, "وارد کردن تصویر مقاله الزامی است"],
    },
    title: {
      type: String,
      unique: true,
      required: [true, "وارد کردن عنوان مقاله الزامی است"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "وارد کردن تاریخ مقاله الزامی است"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "نوشتن توضیحات مقاله الزامی است"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    tableOfContents: {
      type: [tableOfContentItemSchema],
      default: [],
    },
    htmlContent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;