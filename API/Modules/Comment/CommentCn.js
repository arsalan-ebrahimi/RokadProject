import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Comment from "./CommentMd.js";

export const create = catchAsync(async (req, res, next) => {
  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(new HandleERROR("You are not authorized to perform this action", 403));
  }

  const { author, content, role, gender } = req.body;

  if (!author || !content || !role || !gender) {
    return next(new HandleERROR("All fields (author, content, role, gender) are required", 400));
  }

  const newComment = await Comment.create({
    author,
    content,
    role,
    gender
  });

  return res.status(201).json({
    success: true,
    message: "Comment created successfully",
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
    return next(new HandleERROR("Comment not found", 404));
  }

  return res.status(200).json(result);
});

export const update = catchAsync(async (req, res, next) => {
  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(new HandleERROR("You are not authorized to perform this action", 403));
  }

  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new HandleERROR("No comment found with that ID", 404));
  }

  if (!req.body.author && !req.body.content && !req.body.role && !req.body.gender) {
     return next(new HandleERROR("Please provide fields to update", 400));
  }

  comment.author = req.body.author ?? comment.author;
  comment.content = req.body.content ?? comment.content;
  comment.role = req.body.role ?? comment.role;
  comment.gender = req.body.gender ?? comment.gender;

  const updatedComment = await comment.save();

  return res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    data: updatedComment,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(new HandleERROR("You are not authorized to perform this action", 403));
  }

  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    return next(new HandleERROR("No comment found with that ID", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully"
  });
});