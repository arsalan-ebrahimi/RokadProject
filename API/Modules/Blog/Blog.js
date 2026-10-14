import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./BlogCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import { createBlogValidator, updateBlogValidator } from "./BlogValidation.js";

const blogRouter = Router();

blogRouter.route("/")
  .get(getAll)
  .post(IsLogin, IsAdmin, validateRequest(createBlogValidator), create);

blogRouter.route("/:id")
  .get(getOne)
  .patch(IsLogin, IsAdmin, validateRequest(updateBlogValidator), update)
  .delete(IsLogin, IsAdmin, remove);

export default blogRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     TableOfContentItem:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a2b3c4d5e6f7a8b9c0d1e3"
 *         title:
 *           type: string
 *           description: Section heading title
 *           example: "مقدمه‌ای بر استک MERN"
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - img
 *         - date
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *         title:
 *           type: string
 *           description: Blog post title
 *           example: "توسعه وب با استک MERN"
 *         description:
 *           type: string
 *           description: Blog post excerpt/summary
 *           example: "در این مقاله ساختار پروژه‌های فول‌استک را بررسی می‌کنیم..."
 *         img:
 *           type: string
 *           description: Image filename
 *           example: "mern-banner.jpg"
 *         date:
 *           type: string
 *           description: Publication date
 *           example: "1404/06/15"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["برنامه‌نویسی", "آموزش", "ری‌اکت"]
 *         tableOfContents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TableOfContentItem'
 *         htmlContent:
 *           type: string
 *           description: Sanitized HTML body of the article
 *           example: "<p>متن کامل مقاله به همراه <strong>کدهای نمونه</strong>...</p>"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BlogInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - img
 *         - date
 *       properties:
 *         title:
 *           type: string
 *           example: "توسعه وب با استک MERN"
 *         description:
 *           type: string
 *           example: "در این مقاله ساختار پروژه‌های فول‌استک را بررسی می‌کنیم..."
 *         img:
 *           type: string
 *           example: "mern-banner.jpg"
 *         date:
 *           type: string
 *           example: "1404/06/15"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["برنامه‌نویسی", "آموزش"]
 *         tableOfContents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "مقدمه و تعاریف اولیه"
 *         htmlContent:
 *           type: string
 *           example: "<h2>بخش اول</h2><p>متن مقاله...</p>"
 *     BlogResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "مقاله با موفقیت ایجاد شد"
 *         data:
 *           $ref: '#/components/schemas/Blog'
 *     BlogListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         results:
 *           type: integer
 *           example: 10
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Blog'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             total:
 *               type: integer
 *               example: 25
 *             totalPages:
 *               type: integer
 *               example: 3
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "پیام خطای مربوطه"
 *         statusCode:
 *           type: integer
 *           example: 400
 */

/**
 * @swagger
 * tags:
 *   - name: Blog
 *     description: مدیریت مقالات و وبلاگ
 */

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: دریافت لیست مقالات با قابلیت فیلتر، صفحه‌بندی و جستجو
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: جستجو در عنوان، توضیحات و تگ‌ها
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: "-createdAt"
 *     responses:
 *       200:
 *         description: لیست مقالات با موفقیت دریافت شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogListResponse'
 *   post:
 *     summary: ایجاد مقاله جدید (نیاز به دسترسی ادمین)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogInput'
 *     responses:
 *       201:
 *         description: مقاله با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogResponse'
 *       400:
 *         description: خطای اعتبارسنجی داده‌ها
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: عدم احراز هویت
 *       403:
 *         description: عدم دسترسی مدیریت
 */

/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     summary: دریافت یک مقاله با شناسه
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: جزئیات مقاله
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogResponse'
 *       404:
 *         description: مقاله یافت نشد
 *   patch:
 *     summary: ویرایش مقاله (نیاز به دسترسی ادمین)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               img:
 *                 type: string
 *               date:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               tableOfContents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *               htmlContent:
 *                 type: string
 *     responses:
 *       200:
 *         description: مقاله با موفقیت بروزرسانی شد
 *       400:
 *         description: خطای اعتبارسنجی
 *       404:
 *         description: مقاله یافت نشد
 *   delete:
 *     summary: حذف مقاله (نیاز به دسترسی ادمین)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: مقاله با موفقیت حذف شد
 *       404:
 *         description: مقاله یافت نشد
 */