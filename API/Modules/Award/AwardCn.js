import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Award from "./AwardMd.js";

export const create = catchAsync(async (req, res, next) => {
  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(new HandleERROR("You are not authorized to perform this action", 403));
  }

  const { title } = req.body;

  if (!title) {
    return next(new HandleERROR("Title is required", 400));
  }

  const newAward = await Award.create({ title });

  return res.status(201).json({
    success: true,
    message: "Award created successfully",
    data: newAward,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Award, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Award, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const result = await features.execute();

  if (!result || (Array.isArray(result) && result.length === 0)) {
    return next(new HandleERROR("Award not found", 404));
  }

  return res.status(200).json(result);
});

export const update = catchAsync(async (req, res, next) => {
  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(new HandleERROR("You are not authorized to perform this action", 403));
  }

  const allowedUpdates = ["title"];
  const updates = {};

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) updates[el] = req.body[el];
  });

  const updatedAward = await Award.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedAward) {
    return next(new HandleERROR("Award not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Award updated successfully",
    data: updatedAward,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  if (!["admin", "superAdmin"].includes(req.role)) {
    return next(new HandleERROR("You are not authorized to perform this action", 403));
  }

  const deleteAward = await Award.findByIdAndDelete(req.params.id);

  if (!deleteAward) {
    return next(new HandleERROR("Award not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Award deleted successfully",
    data: null,
  });
});