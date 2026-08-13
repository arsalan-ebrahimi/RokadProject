import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Comment from "./CommentMd.js";

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
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
    
  const result = await features.execute();

  if (!result || (Array.isArray(result) && result.length === 0)) {
    return next(new HandleERROR("نظر یافت نشد", 404));
  }

  return res.status(200).json(result);
});

export const update = catchAsync(async (req, res, next) => {
  const allowedUpdates = ["author", "content", "role", "img"];
  const updates = {};

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) updates[el] = req.body[el];
  });

  const updatedComment = await Comment.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedComment) {
    return next(new HandleERROR("نظر یافت نشد", 404));
  }

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

  return res.status(200).json({
    success: true,
    message: "نظر با موفقیت حذف شد",
    data: null
  });
});