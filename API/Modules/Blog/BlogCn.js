import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Blog from "./BlogMd.js";

export const create = catchAsync(async (req, res, next) => {
  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(new HandleERROR("You are not authorized to perform this action", 403));
  }

  const { title, description, img, date } = req.body;

  if (!title) return next(new HandleERROR("Title is required", 400));

  const existingBlog = await Blog.findOne({ title });
  if (existingBlog) {
    return next(new HandleERROR("Blog with this title already exists", 400));
  }

  const newBlog = await Blog.create({ title, description, img, date });

  return res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: newBlog
  });
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Blog, req.query)
    .addManualFilters({ _id: req.params.id })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const result = await features.execute();

  return res.status(200).json(result);
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Blog, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
    
  const result = await features.execute();
  return res.status(200).json(result);
});

export const update = catchAsync(async (req, res, next) => {
  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(new HandleERROR("You are not authorized to perform this action", 403));
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new HandleERROR("No blog found with that ID", 404));
  }

  blog.title = req.body.title ?? blog.title;
  blog.description = req.body.description ?? blog.description;
  blog.img = req.body.img ?? blog.img;
  blog.date = req.body.date ?? blog.date;

  const updatedBlog = await blog.save();

  return res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    data: updatedBlog
  });
});

export const remove = catchAsync(async (req, res, next) => {
  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(new HandleERROR("You are not authorized to perform this action", 403));
  }

  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return next(new HandleERROR("No blog found with that ID", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Blog deleted successfully"
  });
});