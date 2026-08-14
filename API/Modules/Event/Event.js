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
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - date
 *         - description
 *         - branch
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *         title:
 *           type: string
 *           description: Event title
 *           example: "جشنواره علمی پژوهشی"
 *         type:
 *           type: string
 *           description: Event type
 *           example: "مسابقه"
 *         date:
 *           type: string
 *           description: Event date
 *           example: "2026-09-10"
 *         description:
 *           type: string
 *           description: Event description
 *           example: "توضیحات کامل درباره نحوه برگزاری رویداد..."
 *         branch:
 *           type: string
 *           description: School branch (دخترانه or پسرانه)
 *           example: "دخترانه"
 *         __v:
 *           type: integer
 *           description: Version key
 *           example: 0
 *     EventInput:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - date
 *         - description
 *         - branch
 *       properties:
 *         title:
 *           type: string
 *           example: "جشنواره علمی پژوهشی"
 *         type:
 *           type: string
 *           example: "مسابقه"
 *         date:
 *           type: string
 *           example: "2026-09-10"
 *         description:
 *           type: string
 *           example: "توضیحات کامل درباره نحوه برگزاری رویداد..."
 *         branch:
 *           type: string
 *           example: "دخترانه"
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
 *           example: 10
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Event'
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
 *           example: "متن خطا در اینجا نمایش داده می‌شود"
 *         statusCode:
 *           type: integer
 *           example: 400
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: Event Management Endpoints (Powered by Vanta-API)
 */

/**
 * @swagger
 * /api/event:
 *   get:
 *     summary: Retrieve all events with advanced Vanta-API features
 *     tags: [Events]
 *     description: |
 *       Fetch a list of events with full support for Vanta-API advanced querying features.
 *       
 *       ### 💡 Important: Dynamic Query Keys
 *       The parameter fields shown below (like `title[regex]` or `date[gte]`) are **DYNAMIC**. 
 *       We used `title` and `date` in the Swagger form just so you can easily test them. In your actual frontend code, **you can replace them with any field name from the model** (e.g., `branch[regex]=...`).
 *       
 *       ---
 *       
 *       ### Frontend Developer Guide
 *       
 *       1. Global Search (q):
 *          - Description: Performs a case-insensitive text search across all indexed string fields in the database schema.
 *          - Example: /api/event?q=جشنواره
 *       
 *       2. Pagination (page and limit):
 *          - Description: Splits large data sets into smaller chunks to optimize client rendering.
 *          - Example: /api/event?page=2&limit=5
 *       
 *       3. Field Limiting (fields):
 *          - Description: Projection operator to include specific fields, or exclude unneeded fields by adding a minus (-) prefix.
 *          - Example (Include): /api/event?fields=title,branch
 *          - Example (Exclude): /api/event?fields=-description
 *       
 *       4. Sorting (sort):
 *          - Description: Orders records by one or multiple fields. Add a minus (-) prefix for descending order.
 *          - Example: /api/event?sort=-date
 *       
 *       5. Entity Population (populate):
 *          - Description: Replaces referenced MongoDB ObjectIds with their fully populated target documents.
 *          - Example: /api/event?populate=author
 *       
 *       6. Flexible Regex Filtering ([regex]):
 *          - Description: Powerful pattern matching on string fields. It is NOT limited to prefixes; it supports standard regex patterns including substrings, start/end anchors (^, $), and OR logic (|).
 *          - Example (Substring Match): /api/event?title[regex]=علمی
 *          - Example (Starts With / Prefix): /api/event?title[regex]=^جشنواره
 *          - Example (Ends With / Suffix): /api/event?branch[regex]=دخترانه$
 *          - Example (Multiple Choices / OR): /api/event?branch[regex]=دخترانه|پسرانه
 *       
 *       7. Range Comparisons (gte, lte, gt, lt):
 *          - Description: Boundary filtering for numeric or date fields using standard relational operators (greater than [gt], greater than or equal to [gte], less than [lt], less than or equal to [lte]).
 *          - Example: /api/event?date[gte]=2026-01-01&date[lte]=2026-12-31
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Global search query across searchable text fields"
 *         example: "جشنواره"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Active page number for pagination"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Total records returned per page"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "Sorting field name. Prepend with '-' for descending order"
 *         example: "-date"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Comma-separated list of fields to include or exclude"
 *         example: "title,branch"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Comma-separated list of relational fields to populate"
 *         example: "author"
 *       - in: query
 *         name: "title[regex]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'title' is just an example! You can replace it with ANY text field (e.g., branch[regex]). Regex search. Supports standard patterns (^, $, |)"
 *         example: "^جشنواره"
 *       - in: query
 *         name: "date[gte]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'date' is just an example! You can apply [gte] to ANY date/number field. Lower boundary filter (greater than or equal to [gte])"
 *         example: "2026-01-01"
 *       - in: query
 *         name: "date[gt]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'date' is just an example! Strict lower boundary filter (greater than [gt])"
 *       - in: query
 *         name: "date[lte]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'date' is just an example! Upper boundary filter (less than or equal to [lte])"
 *         example: "2026-12-31"
 *       - in: query
 *         name: "date[lt]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'date' is just an example! Strict upper boundary filter (less than [lt])"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of events
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventListResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "خطای سرور رخ داده است"
 *               statusCode: 500
 * 
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     description: Create a new event. Requires admin privileges and Bearer token.
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
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *               example:
 *                 success: true
 *                 message: "رویداد با موفقیت ایجاد شد"
 *                 data:
 *                   _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                   title: "جشنواره علمی پژوهشی"
 *                   type: "مسابقه"
 *                   date: "2026-09-10"
 *                   description: "توضیحات کامل درباره نحوه برگزاری رویداد..."
 *                   branch: "دخترانه"
 *                   __v: 0
 *       400:
 *         description: Bad Request (Validation Error or Duplicate Title)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               DuplicateTitle:
 *                 summary: Duplicate Title Error
 *                 value:
 *                   success: false
 *                   message: "رویدادی با این عنوان قبلاً ثبت شده است"
 *                   statusCode: 400
 *               ValidationError:
 *                 summary: Validation Error
 *                 value:
 *                   success: false
 *                   message: "فیلد عنوان الزامی است"
 *                   statusCode: 400
 *       401:
 *         description: Unauthorized (User not logged in)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "لطفا ابتدا وارد حساب کاربری خود شوید"
 *               statusCode: 401
 *       403:
 *         description: Forbidden (User does not have admin role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "شما مجاز به انجام این عملیات نیستید"
 *               statusCode: 403
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/event/{id}:
 *   get:
 *     summary: Get a specific event by ID
 *     tags: [Events]
 *     description: |
 *       Retrieve detailed information of a single event using its MongoDB ObjectId.
 *       
 *       ### Frontend Developer Guide
 *       Even when fetching a single document by ID, you can use Vanta-API features:
 *       
 *       1. Field Selection (fields):
 *          - Description: Fetch only the exact fields you need from this specific event.
 *          - Example: /api/event/64a2b3c4d5e6f7a8b9c0d1e2?fields=title,branch
 *       
 *       2. Entity Population (populate):
 *          - Description: Expand references into full objects inside this specific event.
 *          - Example: /api/event/64a2b3c4d5e6f7a8b9c0d1e2?populate=author
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event
 *         example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Comma-separated list of fields to include or exclude"
 *         example: "title,branch"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Comma-separated list of relational fields to populate"
 *     responses:
 *       200:
 *         description: Event fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 title: "جشنواره علمی پژوهشی"
 *                 type: "مسابقه"
 *                 date: "2026-09-10"
 *                 description: "توضیحات کامل درباره نحوه برگزاری رویداد..."
 *                 branch: "دخترانه"
 *                 __v: 0
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "رویداد یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update an existing event
 *     tags: [Events]
 *     description: Update specific fields of an event. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "جشنواره علمی پژوهشی (نسخه جدید)"
 *               type:
 *                 type: string
 *                 example: "مسابقه"
 *               date:
 *                 type: string
 *                 example: "2026-09-15"
 *               description:
 *                 type: string
 *                 example: "توضیحات بروزرسانی شده..."
 *               branch:
 *                 type: string
 *                 example: "پسرانه"
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *             example:
 *               success: true
 *               message: "رویداد با موفقیت بروزرسانی شد"
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 title: "جشنواره علمی پژوهشی (نسخه جدید)"
 *                 type: "مسابقه"
 *                 date: "2026-09-15"
 *                 description: "توضیحات بروزرسانی شده..."
 *                 branch: "پسرانه"
 *                 __v: 0
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "عنوان نمی‌تواند خالی باشد"
 *               statusCode: 400
 *       401:
 *         description: Unauthorized (User not logged in)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "لطفا ابتدا وارد حساب کاربری خود شوید"
 *               statusCode: 401
 *       403:
 *         description: Forbidden (User does not have admin role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "شما مجاز به انجام این عملیات نیستید"
 *               statusCode: 403
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "رویداد یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     description: Permanently remove an event from the database. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "رویداد با موفقیت حذف شد"
 *                 data:
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "لطفا ابتدا وارد حساب کاربری خود شوید"
 *               statusCode: 401
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "شما مجاز به انجام این عملیات نیستید"
 *               statusCode: 403
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "رویداد یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */