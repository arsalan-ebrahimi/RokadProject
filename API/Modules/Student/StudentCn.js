import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Student from "./StudentMd.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const create = catchAsync(async (req, res, next) => {
  const { fullName, job, generation, img, socialLinks } = req.body;

  const newStudent = await Student.create({ fullName, job, generation, img, socialLinks });

  return res.status(201).json({
    success: true,
    message: "دانش‌آموز با موفقیت ثبت شد",
    data: newStudent,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Student, req.query, req.role)
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
  const features = new ApiFeatures(Student, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .limitFields()
    .populate();

  const result = await features.execute();

  const doc = Array.isArray(result) ? result[0] : result?.data ? result.data[0] : result;

  if (!doc) {
    return next(new HandleERROR("دانش‌آموز یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    data: doc
  });
});

export const update = catchAsync(async (req, res, next) => {
  const allowedUpdates = ["fullName", "job", "generation", "img", "socialLinks"];
  const updates = {};

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) updates[el] = req.body[el];
  });

  const oldStudent = await Student.findById(req.params.id);
  if (!oldStudent) {
    return next(new HandleERROR("دانش‌آموز یافت نشد", 404));
  }

  // Delete old image from hard drive if a new one is uploaded
  if (updates.img && updates.img !== oldStudent.img) {
    const filePath = path.join(__dirname, "../../Public", oldStudent.img);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

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

  // Delete associated image from hard drive
  if (deleteStudent.img) {
    const filePath = path.join(__dirname, "../../Public", deleteStudent.img);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return res.status(200).json({
    success: true,
    message: "دانش‌آموز با موفقیت حذف شد",
    data: null,
  });
});