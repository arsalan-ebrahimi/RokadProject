import multer from "multer";
import { __dirname } from "../app.js";
import path from "path";
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
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

export default upload;
