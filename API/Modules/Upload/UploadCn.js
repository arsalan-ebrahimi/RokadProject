import fs from "fs";
import { catchAsync, HandleERROR } from "vanta-api";
import { __dirname } from "../../app.js";

export const uploadSingle = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new HandleERROR("No file uploaded", 400));
  }
  return res.status(201).json({
    message: "File uploaded successfully",
    data: file.filename,
    success: true,
  });
});
export const uploadMultiple = catchAsync(async (req, res, next) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return next(new HandleERROR("No files uploaded", 400));
  }
  const data = files.map((file) => file.filename);
  return res
    .status(201)
    .json({ message: "Files uploaded successfully", data, success: true });
});
export const removeData = catchAsync(async (req, res, next) => {
  const { filename } = req.body;
  const removeDataFilename = filename.split("/").at(-1);
  if (fs.existsSync(`${__dirname}/Public/${removeDataFilename}`)) {
    fs.unlinkSync(`${__dirname}/Public/${removeDataFilename}`);
  } else {
    return next(new HandleERROR("File not found", 404));
  }
  return res
    .status(200)
    .json({ message: "File removed successfully", success: true });
});
