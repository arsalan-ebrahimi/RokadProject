import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Event from "./EventMd.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const create = catchAsync(async (req, res, next) => {
  const { title, type, date, description, branch, img } = req.body;

  const existingEvent = await Event.findOne({ title });
  if (existingEvent) {
    return next(new HandleERROR("رویدادی با این عنوان قبلاً ثبت شده است", 400));
  }

  const newEvent = await Event.create({
    title,
    type,
    date,
    description,
    branch,
    img,
  });

  return res.status(201).json({
    success: true,
    message: "رویداد با موفقیت ایجاد شد",
    data: newEvent,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Event, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Event, req.query, req.role)
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
    return next(new HandleERROR("رویداد یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    data: doc,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const allowedUpdates = [
    "title",
    "type",
    "date",
    "description",
    "branch",
    "img",
  ];
  const updates = {};

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) updates[el] = req.body[el];
  });

  const oldEvent = await Event.findById(req.params.id);
  if (!oldEvent) {
    return next(new HandleERROR("رویداد یافت نشد", 404));
  }

  // Delete old image from hard drive if a new one is uploaded
  if (updates.img && updates.img !== oldEvent.img) {
    const filePath = path.join(__dirname, "../../Public", oldEvent.img);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "رویداد با موفقیت بروزرسانی شد",
    data: updatedEvent,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const deleteEvent = await Event.findByIdAndDelete(req.params.id);

  if (!deleteEvent) {
    return next(new HandleERROR("رویداد یافت نشد", 404));
  }

  if (deleteEvent.img) {
    const filePath = path.join(__dirname, "../../Public", deleteEvent.img);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return res.status(200).json({
    success: true,
    message: "رویداد با موفقیت حذف شد",
    data: null,
  });
});
