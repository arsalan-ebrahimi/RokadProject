import multer from "multer";
import { __dirname } from "../app.js";
import path from "path";
import { HandleERROR } from "vanta-api";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/Public`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.originalname.split('.')[0]}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const allowedTypes = /jpeg|jpg|png|svg|webp/;
function fileFilter(req, file, cb) {
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  return cb(new HandleERROR("فرمت فایل غیرمجاز است", 400));
}

const upload = multer({ storage, fileFilter });

export default upload;
