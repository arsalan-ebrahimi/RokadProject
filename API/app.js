import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { catchError, HandleERROR } from "vanta-api";
import { exportValidation } from "./Middleware/ExportValidation.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./Utils/Swagger.js";
import rateLimit from "express-rate-limit";

import authRouter from "./Modules/Auth/Auth.js";
import userRouter from "./Modules/User/User.js";
import blogRouter from "./Modules/Blog/Blog.js";
import enrollmentRouter from "./Modules/Enrollment/Enrollment.js";
import uploadRouter from "./Modules/Upload/Upload.js";
import commentRouter from "./Modules/Comment/Comment.js";
import awardRouter from "./Modules/Award/Award.js";
import studentRouter from "./Modules/Student/Student.js"; 
import eventRouter from "./Modules/Event/Event.js"; // اضافه شدن روتر رویدادها

const app = express();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/Public`));
app.use(exportValidation);

app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/user", userRouter);
app.use("/api/comment", commentRouter);
app.use("/api/award", awardRouter);
app.use("/api/blog", blogRouter);
app.use("/api/enrollment", enrollmentRouter);
app.use("/api/student", studentRouter); 
app.use("/api/event", eventRouter); // اضافه شدن مسیر رویدادها

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  return next(new HandleERROR("مسیر مورد نظر یافت نشد", 404));
});

app.use(catchError);

export default app;