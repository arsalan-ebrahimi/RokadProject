import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./EventCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import { createEventValidator, updateEventValidator } from "./EventValidation.js";

const eventRouter = Router();

eventRouter.route("/")
  .get(getAll)
  .post(IsLogin, IsAdmin, validateRequest(createEventValidator), create);

eventRouter.route("/:id")
  .get(getOne)
  .patch(IsLogin, IsAdmin, validateRequest(updateEventValidator), update)
  .delete(IsLogin, IsAdmin, remove);

export default eventRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     EventOrganizer:
 *       type: object
 *       required:
 *         - name
 *         - role
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: "علی محمدی"
 *         role:
 *           type: string
 *           example: "تسهیلگر و داور فنی"
 *         category:
 *           type: string
 *           enum: ["منتور", "عوامل اجرایی", "داور"]
 *           example: "داور"
 *     EventDeadline:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           example: "پایان مهلت ارسال طرح‌ها"
 *         date:
 *           type: string
 *           example: "1404/08/10"
 *         description:
 *           type: string
 *           example: "کلیه تیم‌ها باید مستندات را بارگذاری نمایند"
 *     TeamPodium:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "تیم آلفا"
 *         isHonored:
 *           type: boolean
 *           example: false
 *     EventTeams:
 *       type: object
 *       properties:
 *         firstTeam:
 *           $ref: '#/components/schemas/TeamPodium'
 *         secondTeam:
 *           $ref: '#/components/schemas/TeamPodium'
 *         thirdTeam:
 *           $ref: '#/components/schemas/TeamPodium'
 *         honoredTeams:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *                 example: "تیم بتا"
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - date
 *         - description
 *         - branch
 *         - img
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *         title:
 *           type: string
 *           example: "ماراتن بازی‌سازی رکاد"
 *         type:
 *           type: string
 *           example: "مسابقه و رویداد تخصصی"
 *         date:
 *           type: string
 *           example: "1404/07/20"
 *         description:
 *           type: string
 *           example: "رویداد سه‌روزه طراحی و توسعه بازی‌های تعاملی..."
 *         branch:
 *           type: array
 *           items:
 *             type: string
 *           example: ["پسرانه", "دخترانه"]
 *         img:
 *           type: string
 *           example: "event-poster.jpg"
 *         eventDuration:
 *           type: string
 *           example: "۳ روز متوالی"
 *         closingLocation:
 *           type: string
 *           example: "سالن همایش‌های بین‌المللی"
 *         holdingDate:
 *           type: string
 *           example: "۲۵ الی ۲۸ مهر ۱۴۰۴"
 *         organizers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EventOrganizer'
 *         teams:
 *           $ref: '#/components/schemas/EventTeams'
 *         howItWent:
 *           type: string
 *           example: "رویداد با حضور ۱۲۰ دانش‌آموز پرانرژی برگزار گردید..."
 *         memorableQuote:
 *           type: object
 *           properties:
 *             quote:
 *               type: string
 *               example: "مهم‌ترین یادگیری، جرأت شروع ایده‌های نو است."
 *             speaker:
 *               type: string
 *               example: "داور ارشد مسابقات"
 *         deadlinesDescription:
 *           type: string
 *           example: "زمان‌بندی مراحل ثبت‌نام، پیش‌رویداد و داوری نهایی"
 *         deadlines:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EventDeadline'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["مسابقه", "نوآوری", "بازی‌سازی"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     EventInput:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - date
 *         - description
 *         - branch
 *         - img
 *         - organizers
 *       properties:
 *         title:
 *           type: string
 *           example: "ماراتن بازی‌سازی رکاد"
 *         type:
 *           type: string
 *           example: "مسابقه و رویداد تخصصی"
 *         date:
 *           type: string
 *           example: "1404/07/20"
 *         description:
 *           type: string
 *           example: "رویداد سه‌روزه طراحی و توسعه بازی‌های تعاملی..."
 *         branch:
 *           type: array
 *           items:
 *             type: string
 *           example: ["پسرانه"]
 *         img:
 *           type: string
 *           example: "event-poster.jpg"
 *         eventDuration:
 *           type: string
 *           example: "۳ روز"
 *         closingLocation:
 *           type: string
 *           example: "آمفی تئاتر مرکزی"
 *         holdingDate:
 *           type: string
 *           example: "1404/07/25"
 *         organizers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EventOrganizer'
 *         teams:
 *           $ref: '#/components/schemas/EventTeams'
 *         howItWent:
 *           type: string
 *         memorableQuote:
 *           type: object
 *           properties:
 *             quote:
 *               type: string
 *             speaker:
 *               type: string
 *         deadlinesDescription:
 *           type: string
 *         deadlines:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EventDeadline'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     EventResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "رویداد با موفقیت ایجاد شد"
 *         data:
 *           $ref: '#/components/schemas/Event'
 *     EventListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         results:
 *           type: integer
 *           example: 5
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Event'
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
 *   - name: Event
 *     description: مدیریت رویدادها، همایش‌ها و کارگاه‌ها
 */

/**
 * @swagger
 * /api/event:
 *   get:
 *     summary: دریافت لیست کلیه رویدادها با فیلتر و جستجو
 *     tags: [Event]
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
 *         description: لیست رویدادها با موفقیت دریافت شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventListResponse'
 *   post:
 *     summary: ایجاد رویداد جدید (نیاز به دسترسی ادمین)
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: رویداد با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 */

/**
 * @swagger
 * /api/event/{id}:
 *   get:
 *     summary: دریافت جزئیات یک رویداد با شناسه
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: جزئیات رویداد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *       404:
 *         description: رویداد یافت نشد
 *   patch:
 *     summary: ویرایش رویداد (نیاز به دسترسی ادمین)
 *     tags: [Event]
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
 *         description: رویداد با موفقیت بروزرسانی شد
 *       404:
 *         description: رویداد یافت نشد
 *   delete:
 *     summary: حذف رویداد (نیاز به دسترسی ادمین)
 *     tags: [Event]
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
 *         description: رویداد با موفقیت حذف شد
 *       404:
 *         description: رویداد یافت نشد
 */