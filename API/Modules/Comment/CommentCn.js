import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Comment from "./CommentMd.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const create = catchAsync(async (req, res, next) => {
  const { author, content, role, img } = req.body;

  const newComment = await Comment.create({ author, content, role, img });

  return res.status(201).json({
    success: true,
    message: "نظر با موفقیت ثبت شد",
    data: newComment
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Comment, req.query, req.role)
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
  const features = new ApiFeatures(Comment, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .limitFields()
    .populate();

  const result = await features.execute();

  const doc = Array.isArray(result) ? result[0] : result?.data ? result.data[0] : result;

  if (!doc) {
    return next(new HandleERROR("نظر یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    data: doc
  });
});

export const update = catchAsync(async (req, res, next) => {
  const allowedUpdates = ["author", "content", "role", "img"];
  const updates = {};

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) updates[el] = req.body[el];
  });

  const oldComment = await Comment.findById(req.params.id);
  if (!oldComment) {
    return next(new HandleERROR("نظر یافت نشد", 404));
  }


  if (updates.img && updates.img !== oldComment.img && !oldComment.img.startsWith("default-")) {
    const filePath = path.join(__dirname, "../../Public", oldComment.img); 
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  const updatedComment = await Comment.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "نظر با موفقیت بروزرسانی شد",
    data: updatedComment,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const deleteComment = await Comment.findByIdAndDelete(req.params.id);

  if (!deleteComment) {
    return next(new HandleERROR("نظر یافت نشد", 404));
  }

  if (deleteComment.img && !deleteComment.img.startsWith("default-")) {
    const filePath = path.join(__dirname, "../../Public", deleteComment.img); 
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return res.status(200).json({
    success: true,
    message: "نظر با موفقیت حذف شد",
    data: null
  });
});