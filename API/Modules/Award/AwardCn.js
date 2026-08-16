import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Award from "./AwardMd.js";

export const create = catchAsync(async (req, res, next) => {
  const { title, rank, description, winners } = req.body;

  const existingAward = await Award.findOne({ title });
  if (existingAward) {
    return next(new HandleERROR("جایزه‌ای با این عنوان قبلاً ثبت شده است", 400));
  }

  const newAward = await Award.create({ title, rank, description, winners });

  return res.status(201).json({
    success: true,
    message: "جایزه با موفقیت ایجاد شد",
    data: newAward
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
    .limitFields()
    .populate();

  const result = await features.execute();

  const doc = Array.isArray(result) ? result[0] : result?.data ? result.data[0] : result;

  if (!doc) {
    return next(new HandleERROR("جایزه یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    data: doc
  });
});

export const update = catchAsync(async (req, res, next) => {
  const allowedUpdates = ["title", "rank", "description", "winners"];
  const updates = {};

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) updates[el] = req.body[el];
  });

  const updatedAward = await Award.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedAward) {
    return next(new HandleERROR("جایزه یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    message: "جایزه با موفقیت بروزرسانی شد",
    data: updatedAward
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const deleteAward = await Award.findByIdAndDelete(req.params.id);

  if (!deleteAward) {
    return next(new HandleERROR("جایزه یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    message: "جایزه با موفقیت حذف شد"
  });
});