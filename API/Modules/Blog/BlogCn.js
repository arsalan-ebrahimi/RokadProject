import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Blog from "./BlogMd.js";

export const create = catchAsync(async (req, res, next) => {
  const { title, description, img, date } = req.body;

  const existingBlog = await Blog.findOne({ title });
  if (existingBlog) {
    return next(new HandleERROR("مقاله‌ای با این عنوان قبلاً ثبت شده است", 400));
  }

  const newBlog = await Blog.create({ title, description, img, date });

  return res.status(201).json({
    success: true,
    message: "مقاله با موفقیت ایجاد شد",
    data: newBlog
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Blog, req.query, req.role)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
    
  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Blog, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .limitFields()
    .populate();

  const result = await features.execute();

  const doc = Array.isArray(result) ? result[0] : result?.data ? result.data[0] : result;

  if (!doc) {
    return next(new HandleERROR("مقاله یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    data: doc
  });
});

export const update = catchAsync(async (req, res, next) => {
  const allowedUpdates = ["title", "description", "img", "date"];
  const updates = {};

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) updates[el] = req.body[el];
  });

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedBlog) {
    return next(new HandleERROR("مقاله یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    message: "مقاله با موفقیت بروزرسانی شد",
    data: updatedBlog
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const deleteBlog = await Blog.findByIdAndDelete(req.params.id);

  if (!deleteBlog) {
    return next(new HandleERROR("مقاله یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    message: "مقاله با موفقیت حذف شد",
    data: null
  });
});