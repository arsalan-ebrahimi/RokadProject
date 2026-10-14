import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./StudentCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import { createStudentValidator, updateStudentValidator } from "./StudentValidation.js";

const studentRouter = Router();

studentRouter.route("/")
  .get(getAll)
  .post(IsLogin, IsAdmin, validateRequest(createStudentValidator), create);

studentRouter.route("/:id")
  .get(getOne)
  .patch(IsLogin, IsAdmin, validateRequest(updateStudentValidator), update)
  .delete(IsLogin, IsAdmin, remove);

export default studentRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     SocialLink:
 *       type: object
 *       required:
 *         - type
 *         - link
 *       properties:
 *         _id:
 *           type: string
 *         type:
 *           type: string
 *           example: "github"
 *         link:
 *           type: string
 *           example: "https://github.com/example"
 *     KeyActivity:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           example: "عضو تیم طراحی هویت بصری رویدادها"
 *         description:
 *           type: string
 *           example: "مدیریت و پیاده‌سازی متریال‌های تبلیغاتی در دوره تحصیلی"
 *     Student:
 *       type: object
 *       required:
 *         - fullName
 *         - job
 *         - generation
 *         - schoolType
 *         - major
 *         - img
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *         fullName:
 *           type: string
 *           example: "محمد رضایی"
 *         job:
 *           type: string
 *           description: Current job status
 *           example: "توسعه‌دهنده فرانت‌اند در اسنپ"
 *         generation:
 *           type: integer
 *           example: 3
 *         major:
 *           type: string
 *           example: "تولید و توسعه پایگاه‌های اینترنتی"
 *         schoolType:
 *           type: string
 *           example: "هنرستان پسرانه رکاد"
 *         img:
 *           type: string
 *           example: "avatar-rezaei.jpg"
 *         socialLinks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SocialLink'
 *         about:
 *           type: string
 *           description: Long bio / about student
 *           example: "محمد رضایی از فارغ‌التحصیلان برتر نسل ۳ رشته نرم‌افزار..."
 *         rokadStory:
 *           type: string
 *           description: Story and journey with Rokad
 *           example: "ورود به رکاد نقطه عطفی در یادگیری عملی و کار تیمی من بود..."
 *         achievements:
 *           type: string
 *           description: Honors and achievements
 *           example: "کسب رتبه نخست در المپیاد مهارت و منتور پروژه‌های کلاسی"
 *         keyActivities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/KeyActivity'
 *         currentCity:
 *           type: string
 *           description: City of current activity
 *           example: "تهران"
 *         graduationYear:
 *           type: string
 *           description: Year of graduation
 *           example: "1402"
 *         portfolioCount:
 *           type: integer
 *           description: Number of portfolio projects
 *           example: 12
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     StudentInput:
 *       type: object
 *       required:
 *         - fullName
 *         - job
 *         - generation
 *         - schoolType
 *         - major
 *         - img
 *       properties:
 *         fullName:
 *           type: string
 *           example: "محمد رضایی"
 *         job:
 *           type: string
 *           example: "توسعه‌دهنده فرانت‌اند در اسنپ"
 *         generation:
 *           type: integer
 *           example: 3
 *         major:
 *           type: string
 *           example: "تولید و توسعه پایگاه‌های اینترنتی"
 *         schoolType:
 *           type: string
 *           example: "هنرستان پسرانه رکاد"
 *         img:
 *           type: string
 *           example: "avatar-rezaei.jpg"
 *         socialLinks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SocialLink'
 *         about:
 *           type: string
 *         rokadStory:
 *           type: string
 *         achievements:
 *           type: string
 *         keyActivities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/KeyActivity'
 *         currentCity:
 *           type: string
 *           example: "تهران"
 *         graduationYear:
 *           type: string
 *           example: "1402"
 *         portfolioCount:
 *           type: integer
 *           example: 12
 *     StudentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "دانش‌آموز با موفقیت ثبت شد"
 *         data:
 *           $ref: '#/components/schemas/Student'
 *     StudentListResponse:
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
 *             $ref: '#/components/schemas/Student'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "پیام خطای مربوطه"
 */

/**
 * @swagger
 * tags:
 *   - name: Student
 *     description: مدیریت پرونده دانش‌آموزان و فارغ‌التحصیلان برجسته
 */

/**
 * @swagger
 * /api/student:
 *   get:
 *     summary: دریافت لیست کلیه دانش‌آموزان با جستجو و صفحه‌بندی
 *     tags: [Student]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: لیست دانش‌آموزان
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentListResponse'
 *   post:
 *     summary: ثبت پرونده دانش‌آموز جدید (نیاز به دسترسی ادمین)
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       201:
 *         description: دانش‌آموز با موفقیت ثبت شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 */

/**
 * @swagger
 * /api/student/{id}:
 *   get:
 *     summary: دریافت اطلاعات کامل پرونده یک دانش‌آموز
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: جزئیات پرونده دانش‌آموز
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 *       404:
 *         description: دانش‌آموز یافت نشد
 *   patch:
 *     summary: ویرایش پرونده دانش‌آموز (نیاز به دسترسی ادمین)
 *     tags: [Student]
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
 *     responses:
 *       200:
 *         description: اطلاعات دانش‌آموز با موفقیت بروزرسانی شد
 *       404:
 *         description: دانش‌آموز یافت نشد
 *   delete:
 *     summary: حذف پرونده دانش‌آموز (نیاز به دسترسی ادمین)
 *     tags: [Student]
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
 *         description: دانش‌آموز با موفقیت حذف شد
 *       404:
 *         description: دانش‌آموز یافت نشد
 */