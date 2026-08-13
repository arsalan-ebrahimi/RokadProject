import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Event from "./EventMd.js";

export const create = catchAsync(async (req, res, next) => {
  const { title, type, date, description, branch } = req.body;

  const existingEvent = await Event.findOne({ title });
  if (existingEvent) {
    return next(new HandleERROR("رویدادی با این عنوان قبلاً ثبت شده است", 400));
  }

  const newEvent = await Event.create({ title, type, date, description, branch });

  return res.status(201).json({
    success: true,
    message: "رویداد با موفقیت ایجاد شد",
    data: newEvent
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
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const result = await features.execute();

  if (!result || (Array.isArray(result) && result.length === 0)) {
    return next(new HandleERROR("رویداد یافت نشد", 404));
  }

  return res.status(200).json(result);
});

export const update = catchAsync(async (req, res, next) => {
  const allowedUpdates = ["title", "type", "date", "description", "branch"];
  const updates = {};

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) updates[el] = req.body[el];
  });

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedEvent) {
    return next(new HandleERROR("رویداد یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    message: "رویداد با موفقیت بروزرسانی شد",
    data: updatedEvent
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const deleteEvent = await Event.findByIdAndDelete(req.params.id);

  if (!deleteEvent) {
    return next(new HandleERROR("رویداد یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    message: "رویداد با موفقیت حذف شد",
    data: null
  });
});