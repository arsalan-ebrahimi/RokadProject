import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  img: {
    type: String,
    required: [true, "Image is requierd"],
   },
  title: {
    type: String,
    unique  : true,
    required: [true, "Title is requierd"],
  },
  date: {
    type: String,
    required: [true, "date is requierd"],
  },
  description: {
    type: String,
    required: [true, "description is requierd"],
  },
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
