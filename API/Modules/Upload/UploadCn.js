import fs from "fs";
import path from "path";
import { catchAsync, HandleERROR } from "vanta-api";
import { __dirname } from "../../app.js";

/**
 * Validates the file's binary signature (magic bytes) to ensure
 * the uploaded content truly matches an allowed image format.
 */
const verifyFileMagicBytes = (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const buffer = Buffer.alloc(32);
    const fd = fs.openSync(filePath, "r");
    fs.readSync(fd, buffer, 0, 32, 0);
    fs.closeSync(fd);

    if (ext === ".jpg" || ext === ".jpeg") {
      // JPEG magic bytes: FF D8 FF
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }

    if (ext === ".png") {
      // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
      );
    }

    if (ext === ".webp") {
      // WebP signature: RIFF ... WEBP
      const riff = buffer.toString("ascii", 0, 4);
      const webp = buffer.toString("ascii", 8, 12);
      return riff === "RIFF" && webp === "WEBP";
    }

    if (ext === ".svg") {
      // SVG text validation: must be XML/SVG and contain no executable script or active content
      const content = fs.readFileSync(filePath, "utf8");
      const lower = content.toLowerCase();
      const hasSvgTag = lower.includes("<svg");
      const hasDangerousContent =
        lower.includes("<script") ||
        lower.includes("javascript:") ||
        lower.includes("<foreignobject") ||
        lower.includes("onload=") ||
        lower.includes("onerror=");

      return hasSvgTag && !hasDangerousContent;
    }

    return false;
  } catch (error) {
    return false;
  }
};

export const uploadSingle = catchAsync(async (req, res, next) => {
  const file = req.file;

  if (!file) {
    return next(new HandleERROR("هیچ فایلی آپلود نشده است", 400));
  }

  const validExtRegex = /\.(jpe?g|png|svg|webp)$/i;
  if (!validExtRegex.test(file.filename) || !validExtRegex.test(file.originalname)) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return next(new HandleERROR("پسوند فایل غیرمجاز است", 400));
  }

  if (file.originalname.toLowerCase().startsWith("default-")) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return next(new HandleERROR("استفاده از نام‌های رزرو شده سیستم (مثل default-) مجاز نیست", 403));
  }

  // Validate magic bytes
  if (!verifyFileMagicBytes(file.path)) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return next(new HandleERROR("محتوای فایل ارسالی با فرمت تصویر همخوانی ندارد یا مخرب است", 400));
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

  const validExtRegex = /\.(jpe?g|png|svg|webp)$/i;
  const hasInvalidExt = files.some(
    (file) => !validExtRegex.test(file.filename) || !validExtRegex.test(file.originalname)
  );
  if (hasInvalidExt) {
    files.forEach((file) => {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
    return next(new HandleERROR("پسوند برخی از فایل‌ها غیرمجاز است", 400));
  }

  const hasInvalidName = files.some((file) =>
    file.originalname.toLowerCase().startsWith("default-")
  );

  if (hasInvalidName) {
    files.forEach((file) => {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
    return next(new HandleERROR("استفاده از نام‌های رزرو شده سیستم (مثل default-) مجاز نیست", 403));
  }

  // Validate magic bytes for all files
  const hasCorruptedFile = files.some((file) => !verifyFileMagicBytes(file.path));
  if (hasCorruptedFile) {
    files.forEach((file) => {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
    return next(new HandleERROR("محتوای یکی از فایل‌ها با فرمت مجاز همخوانی ندارد", 400));
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

  if (!filename || typeof filename !== "string") {
    return next(new HandleERROR("ارسال نام فایل برای حذف الزامی است", 400));
  }

  // Prevent path traversal on both Unix (/) and Windows (\)
  const sanitizedFilename = path.basename(filename.replace(/\\/g, "/"));

  const validExtRegex = /\.(jpe?g|png|svg|webp)$/i;
  if (!validExtRegex.test(sanitizedFilename)) {
    return next(new HandleERROR("فقط حذف فایل‌های تصویری مجاز است", 400));
  }

  if (sanitizedFilename.toLowerCase().startsWith("default-")) {
    return next(new HandleERROR("شما اجازه حذف فایل‌های پیش‌فرض و سیستمی را ندارید", 403));
  }

  const publicDir = path.resolve(__dirname, "Public");
  const targetFilePath = path.resolve(publicDir, sanitizedFilename);

  // Strict check: target must be inside publicDir and cannot traverse outside
  if (!targetFilePath.startsWith(publicDir)) {
    return next(new HandleERROR("مسیر فایل نامعتبر است", 400));
  }

  if (fs.existsSync(targetFilePath)) {
    fs.unlinkSync(targetFilePath);
  } else {
    return next(new HandleERROR("فایل مورد نظر یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    message: "فایل با موفقیت حذف شد",
    data: null,
  });
});