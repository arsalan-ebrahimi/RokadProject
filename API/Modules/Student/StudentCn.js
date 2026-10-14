import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Student from "./StudentMd.js";
import { stripHtml } from "../../Utils/htmlSanitizer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const create = catchAsync(async (req, res, next) => {
  const {
    fullName,
    job,
    generation,
    schoolType,
    major,
    img,
    socialLinks,
    about,
    rokadStory,
    achievements,
    keyActivities,
    currentCity,
    graduationYear,
    portfolioCount,
  } = req.body;

  const cleanActivities = Array.isArray(keyActivities)
    ? keyActivities
        .map((act) => ({
          title: typeof act?.title === "string" ? stripHtml(act.title) : "",
          description: typeof act?.description === "string" ? stripHtml(act.description) : "",
        }))
        .filter((act) => act.title)
    : [];

  const cleanSocial = Array.isArray(socialLinks)
    ? socialLinks
        .map((s) => ({
          type: typeof s?.type === "string" ? s.type.trim() : "",
          link: typeof s?.link === "string" ? s.link.trim() : "",
        }))
        .filter((s) => s.type && s.link)
    : [];

  const newStudent = await Student.create({
    fullName: typeof fullName === "string" ? stripHtml(fullName) : "",
    job: typeof job === "string" ? stripHtml(job) : "",
    generation: Number(generation),
    schoolType: typeof schoolType === "string" ? stripHtml(schoolType) : "",
    major: typeof major === "string" ? stripHtml(major) : "",
    img,
    socialLinks: cleanSocial,
    about: typeof about === "string" ? stripHtml(about) : "",
    rokadStory: typeof rokadStory === "string" ? stripHtml(rokadStory) : "",
    achievements: typeof achievements === "string" ? stripHtml(achievements) : "",
    keyActivities: cleanActivities,
    currentCity: typeof currentCity === "string" ? stripHtml(currentCity) : "",
    graduationYear: typeof graduationYear === "string" ? stripHtml(graduationYear) : "",
    portfolioCount: Number(portfolioCount) || 0,
  });

  return res.status(201).json({
    success: true,
    message: "دانش‌آموز با موفقیت ثبت شد",
    data: newStudent,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Student, req.query, req.role)
    .filter()
    .search(["fullName", "job", "schoolType", "major", "currentCity"])
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
    .limitFields()
    .populate();

  const result = await features.execute();

  const doc = Array.isArray(result)
    ? result[0]
    : result?.data
      ? result.data[0]
      : result;

  if (!doc) {
    return next(new HandleERROR("دانش‌آموز مورد نظر یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    data: doc,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const oldStudent = await Student.findById(req.params.id);
  if (!oldStudent) {
    return next(new HandleERROR("دانش‌آموز یافت نشد", 404));
  }

  const updates = {};

  if (req.body.fullName !== undefined) updates.fullName = typeof req.body.fullName === "string" ? stripHtml(req.body.fullName) : req.body.fullName;
  if (req.body.job !== undefined) updates.job = typeof req.body.job === "string" ? stripHtml(req.body.job) : req.body.job;
  if (req.body.generation !== undefined) updates.generation = Number(req.body.generation);
  if (req.body.schoolType !== undefined) updates.schoolType = typeof req.body.schoolType === "string" ? stripHtml(req.body.schoolType) : req.body.schoolType;
  if (req.body.major !== undefined) updates.major = typeof req.body.major === "string" ? stripHtml(req.body.major) : req.body.major;
  if (req.body.about !== undefined) updates.about = typeof req.body.about === "string" ? stripHtml(req.body.about) : req.body.about;
  if (req.body.rokadStory !== undefined) updates.rokadStory = typeof req.body.rokadStory === "string" ? stripHtml(req.body.rokadStory) : req.body.rokadStory;
  if (req.body.achievements !== undefined) updates.achievements = typeof req.body.achievements === "string" ? stripHtml(req.body.achievements) : req.body.achievements;
  if (req.body.currentCity !== undefined) updates.currentCity = typeof req.body.currentCity === "string" ? stripHtml(req.body.currentCity) : req.body.currentCity;
  if (req.body.graduationYear !== undefined) updates.graduationYear = typeof req.body.graduationYear === "string" ? stripHtml(req.body.graduationYear) : req.body.graduationYear;
  if (req.body.portfolioCount !== undefined) updates.portfolioCount = Number(req.body.portfolioCount) || 0;

  if (req.body.keyActivities !== undefined) {
    updates.keyActivities = Array.isArray(req.body.keyActivities)
      ? req.body.keyActivities
          .map((act) => ({
            title: typeof act?.title === "string" ? stripHtml(act.title) : "",
            description: typeof act?.description === "string" ? stripHtml(act.description) : "",
          }))
          .filter((act) => act.title)
      : [];
  }

  if (req.body.socialLinks !== undefined) {
    updates.socialLinks = Array.isArray(req.body.socialLinks)
      ? req.body.socialLinks
          .map((s) => ({
            type: typeof s?.type === "string" ? s.type.trim() : "",
            link: typeof s?.link === "string" ? s.link.trim() : "",
          }))
          .filter((s) => s.type && s.link)
      : [];
  }

  if (req.body.img !== undefined && req.body.img !== oldStudent.img) {
    updates.img = req.body.img;
    const oldFilePath = path.join(__dirname, "../../Public", oldStudent.img);
    if (fs.existsSync(oldFilePath)) {
      try {
        fs.unlinkSync(oldFilePath);
      } catch (err) {
        console.error("Failed to delete old student image:", err);
      }
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

  if (deleteStudent.img) {
    const filePath = path.join(__dirname, "../../Public", deleteStudent.img);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete student image:", err);
      }
    }
  }

  return res.status(200).json({
    success: true,
    message: "دانش‌آموز با موفقیت حذف شد",
    data: null,
  });
});