import multer from "multer";
import { __dirname } from "../app.js";
import path from "path";
import crypto from "crypto";
import { HandleERROR } from "vanta-api";

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".svg"]);
const ALLOWED_MIMETYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/Public`);
  },
  filename: (req, file, cb) => {
    const rawExt = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : ".jpg";
    // Random server-side filename: timestamp + cryptographically random hex
    const randomName = `${Date.now()}_${crypto.randomBytes(12).toString("hex")}${safeExt}`;
    cb(null, randomName);
  },
});

function fileFilter(req, file, cb) {
  const extname = path.extname(file.originalname || "").toLowerCase();
  const mimetype = (file.mimetype || "").toLowerCase();

  if (ALLOWED_EXTENSIONS.has(extname) && ALLOWED_MIMETYPES.has(mimetype)) {
    return cb(null, true);
  }
  return cb(new HandleERROR("فرمت فایل غیرمجاز است. تنها تصاویر مجاز می‌باشند", 400));
}

const maxUploadSize = Number(process.env.MAX_UPLOAD_SIZE_BYTES) || 5 * 1024 * 1024; // 5MB default

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxUploadSize,
    files: 10,
  },
});

export default upload;
