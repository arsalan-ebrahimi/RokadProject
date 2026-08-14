import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./AwardCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import { createAwardValidator, updateAwardValidator } from "./AwardValidation.js";

const awardRouter = Router();

awardRouter.route("/")
  .get(getAll)
  .post(IsLogin, IsAdmin, validateRequest(createAwardValidator), create);

awardRouter.route("/:id")
  .get(getOne)
  .patch(IsLogin, IsAdmin, validateRequest(updateAwardValidator), update)
  .delete(IsLogin, IsAdmin, remove);

export default awardRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Award:
 *       type: object
 *       required:
 *         - title
 *         - rank
 *         - description
 *         - winners
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *         title:
 *           type: string
 *           description: Award title
 *           example: "جایزه نفر اول المپیاد علمی"
 *         rank:
 *           type: integer
 *           description: Award rank (1, 2, or 3)
 *           example: 1
 *         description:
 *           type: string
 *           description: Award content/description
 *           example: "این جایزه به دانش‌آموزی تعلق می‌گیرد که بالاترین نمره را کسب کرده است."
 *         winners:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of Student ObjectIds
 *           example: ["64a2b3c4d5e6f7a8b9c0d1e2", "64a2b3c4d5e6f7a8b9c0d1e3"]
 *         __v:
 *           type: integer
 *           description: Version key
 *           example: 0
 *     AwardInput:
 *       type: object
 *       required:
 *         - title
 *         - rank
 *         - description
 *         - winners
 *       properties:
 *         title:
 *           type: string
 *           example: "جایزه نفر اول المپیاد علمی"
 *         rank:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "این جایزه به دانش‌آموزی تعلق می‌گیرد که بالاترین نمره را کسب کرده است."
 *         winners:
 *           type: array
 *           items:
 *             type: string
 *           example: ["64a2b3c4d5e6f7a8b9c0d1e2"]
 *     AwardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "جایزه با موفقیت ایجاد شد"
 *         data:
 *           $ref: '#/components/schemas/Award'
 *     AwardListResponse:
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
 *             $ref: '#/components/schemas/Award'
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
 *   - name: Award
 *     description: Award Management Endpoints (Powered by Vanta-API)
 */

/**
 * @swagger
 * /api/award:
 *   get:
 *     summary: Retrieve all awards with advanced Vanta-API features
 *     tags: [Award]
 *     description: |
 *       Fetch a list of awards with full support for Vanta-API advanced querying features.
 *       
 *       ### 💡 Important: Dynamic Query Keys
 *       The parameter fields shown below (like `title[regex]` or `rank[gte]`) are **DYNAMIC**. 
 *       We used `title` and `rank` in the Swagger form just so you can easily test them. In your actual frontend code, **you can replace them with any field name from the model** (e.g., `description[regex]=...`).
 *       
 *       ---
 *       
 *       ### Frontend Developer Guide
 *       
 *       1. Global Search (q):
 *          - Description: Performs a case-insensitive text search across all indexed string fields in the database schema.
 *          - Example: /api/award?q=المپیاد
 *       
 *       2. Pagination (page and limit):
 *          - Description: Splits large data sets into smaller chunks to optimize client rendering.
 *          - Example: /api/award?page=2&limit=5
 *       
 *       3. Field Limiting (fields):
 *          - Description: Projection operator to include specific fields, or exclude unneeded fields by adding a minus (-) prefix.
 *          - Example (Include): /api/award?fields=title,rank
 *          - Example (Exclude): /api/award?fields=-description
 *       
 *       4. Sorting (sort):
 *          - Description: Orders records by one or multiple fields. Add a minus (-) prefix for descending order.
 *          - Example: /api/award?sort=-rank
 *       
 *       5. Entity Population (populate):
 *          - Description: Replaces referenced MongoDB ObjectIds with their fully populated target documents.
 *          - Example: /api/award?populate=winners
 *       
 *       6. Flexible Regex Filtering ([regex]):
 *          - Description: Powerful pattern matching on string fields. It is NOT limited to prefixes; it supports standard regex patterns including substrings, start/end anchors (^, $), and OR logic (|).
 *          - Example (Substring Match): /api/award?title[regex]=المپیاد
 *          - Example (Starts With / Prefix): /api/award?title[regex]=^جایزه
 *          - Example (Ends With / Suffix): /api/award?title[regex]=علمی$
 *          - Example (Multiple Choices / OR): /api/award?title[regex]=ریاضی|فیزیک
 *       
 *       7. Range Comparisons (gte, lte, gt, lt):
 *          - Description: Boundary filtering for numeric fields (like rank) using standard relational operators (greater than [gt], greater than or equal to [gte], less than [lt], less than or equal to [lte]).
 *          - Example: /api/award?rank[gte]=1&rank[lte]=2
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Global search query across searchable text fields"
 *         example: "المپیاد"
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
 *         example: "rank"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Comma-separated list of fields to include or exclude"
 *         example: "title,rank"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Comma-separated list of relational fields to populate"
 *         example: "winners"
 *       - in: query
 *         name: "title[regex]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'title' is just an example! You can replace it with ANY text field (e.g., description[regex]). Regex search. Supports standard patterns (^, $, |)"
 *         example: "^جایزه"
 *       - in: query
 *         name: "rank[gte]"
 *         schema:
 *           type: integer
 *         description: "💡 DYNAMIC FIELD: 'rank' is just an example! You can apply [gte] to ANY numeric/date field. Lower boundary filter (greater than or equal to [gte])"
 *         example: 1
 *       - in: query
 *         name: "rank[gt]"
 *         schema:
 *           type: integer
 *         description: "💡 DYNAMIC FIELD: 'rank' is just an example! Strict lower boundary filter (greater than [gt])"
 *         example: 1
 *       - in: query
 *         name: "rank[lte]"
 *         schema:
 *           type: integer
 *         description: "💡 DYNAMIC FIELD: 'rank' is just an example! Upper boundary filter (less than or equal to [lte])"
 *         example: 3
 *       - in: query
 *         name: "rank[lt]"
 *         schema:
 *           type: integer
 *         description: "💡 DYNAMIC FIELD: 'rank' is just an example! Strict upper boundary filter (less than [lt])"
 *         example: 3
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of awards
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardListResponse'
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
 *     summary: Create a new award
 *     tags: [Award]
 *     description: Create a new award. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AwardInput'
 *     responses:
 *       201:
 *         description: Award created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardResponse'
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
 *                   message: "جایزه‌ای با این عنوان قبلاً ثبت شده است"
 *                   statusCode: 400
 *               ValidationError:
 *                 summary: Validation Error
 *                 value:
 *                   success: false
 *                   message: "مقام باید یکی از مقادیر 1، 2 یا 3 باشد"
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
 * /api/award/{id}:
 *   get:
 *     summary: Get a specific award by ID
 *     tags: [Award]
 *     description: |
 *       Retrieve detailed information of a single award using its MongoDB ObjectId.
 *       
 *       ### Frontend Developer Guide
 *       Even when fetching a single document by ID, you can use Vanta-API features:
 *       
 *       1. Field Selection (fields):
 *          - Description: Fetch only the exact fields you need from this specific award.
 *          - Example: /api/award/64a2b3c4d5e6f7a8b9c0d1e2?fields=title,rank
 *       
 *       2. Entity Population (populate):
 *          - Description: Expand references into full objects inside this specific award.
 *          - Example: /api/award/64a2b3c4d5e6f7a8b9c0d1e2?populate=winners
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the award
 *         example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Comma-separated list of fields to include or exclude"
 *         example: "title,rank"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Comma-separated list of relational fields to populate"
 *         example: "winners"
 *     responses:
 *       200:
 *         description: Award fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 title: "جایزه نفر اول المپیاد علمی"
 *                 rank: 1
 *                 description: "این جایزه به دانش‌آموزی تعلق می‌گیرد که بالاترین نمره را کسب کرده است."
 *                 winners: ["64a2b3c4d5e6f7a8b9c0d1e2"]
 *                 __v: 0
 *       404:
 *         description: Award not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "جایزه یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update an existing award
 *     tags: [Award]
 *     description: Update specific fields of an award. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the award to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "جایزه نفر اول المپیاد علمی (نسخه جدید)"
 *               rank:
 *                 type: integer
 *                 example: 2
 *               description:
 *                 type: string
 *                 example: "توضیحات آپدیت شده..."
 *               winners:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64a2b3c4d5e6f7a8b9c0d1e2"]
 *     responses:
 *       200:
 *         description: Award updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardResponse'
 *             example:
 *               success: true
 *               message: "جایزه با موفقیت بروزرسانی شد"
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 title: "جایزه نفر اول المپیاد علمی (نسخه جدید)"
 *                 rank: 2
 *                 description: "توضیحات آپدیت شده..."
 *                 winners: ["64a2b3c4d5e6f7a8b9c0d1e2"]
 *                 __v: 0
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "مقام باید یکی از مقادیر 1، 2 یا 3 باشد"
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
 *         description: Award not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "جایزه یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Delete an award
 *     tags: [Award]
 *     description: Permanently remove an award from the database. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the award to delete
 *     responses:
 *       200:
 *         description: Award deleted successfully
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
 *                   example: "جایزه با موفقیت حذف شد"
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
 *         description: Award not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "جایزه یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */