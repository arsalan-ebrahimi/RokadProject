import fs from "fs";
import { catchAsync, HandleERROR } from "vanta-api";
import { __dirname } from "../../app.js";

export const uploadSingle = catchAsync(async (req, res, next) => {
  const file = req.file;

  if (!file) {
    return next(new HandleERROR("هیچ فایلی آپلود نشده است", 400));
  }

  if (file.originalname.toLowerCase().startsWith("default-")) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return next(new HandleERROR("استفاده از نام‌های رزرو شده سیستم (مثل default-) مجاز نیست", 403));
  }

  return res.status(201).json({
    success: true,
    message: "فایل با موفقیت آپلود شد",
    data: file.filename,
  });
});

export const uploadMultiple = catchAsync(async (req, res, next) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return next(new HandleERROR("هیچ فایلی آپلود نشده است", 400));
  }

  const hasInvalidName = files.some(file => 
    file.originalname.toLowerCase().startsWith("default-")
  );
  
  if (hasInvalidName) {
    files.forEach(file => {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
    return next(new HandleERROR("استفاده از نام‌های رزرو شده سیستم (مثل default-) مجاز نیست", 403));
  }

  const data = files.map((file) => file.filename);

  return res.status(201).json({
    success: true,
    message: "فایل‌ها با موفقیت آپلود شدند",
    data,
  });
});

export const removeData = catchAsync(async (req, res, next) => {
  const { filename } = req.body;

  if (!filename) {
    return next(new HandleERROR("ارسال نام فایل برای حذف الزامی است", 400));
  }

  const removeDataFilename = filename.split("/").at(-1);

  if (removeDataFilename.toLowerCase().startsWith("default-")) {
    return next(new HandleERROR("شما اجازه حذف فایل‌های پیش‌فرض و سیستمی را ندارید", 403));
  }

  const filePath = `${__dirname}/Public/${removeDataFilename}`;

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  } else {
    return next(new HandleERROR("فایل مورد نظر یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    message: "فایل با موفقیت حذف شد",
    data: null,
  });
});