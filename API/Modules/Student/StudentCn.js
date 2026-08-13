import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Student from "./StudentMd.js";

export const create = catchAsync(async (req, res, next) => {
  const { fullName, job, generation, socialLinks } = req.body;

  const newStudent = await Student.create({ fullName, job, generation, socialLinks });

  return res.status(201).json({
    success: true,
    message: "دانش‌آموز با موفقیت ثبت شد",
    data: newStudent,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Student, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Student, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const result = await features.execute();

  if (!result || (Array.isArray(result) && result.length === 0)) {
    return next(new HandleERROR("دانش‌آموز یافت نشد", 404));
  }

  return res.status(200).json(result);
});

export const update = catchAsync(async (req, res, next) => {
  const allowedUpdates = ["fullName", "job", "generation", "socialLinks"];
  const updates = {};

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) updates[el] = req.body[el];
  });

  const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedStudent) {
    return next(new HandleERROR("دانش‌آموز یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    message: "اطلاعات دانش‌آموز با موفقیت بروزرسانی شد",
    data: updatedStudent,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const deleteStudent = await Student.findByIdAndDelete(req.params.id);

  if (!deleteStudent) {
    return next(new HandleERROR("دانش‌آموز یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    message: "دانش‌آموز با موفقیت حذف شد",
    data: null,
  });
});