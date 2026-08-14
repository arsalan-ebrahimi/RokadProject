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
 *           example: "توسعه وب با MERN Stack"
 *         description:
 *           type: string
 *           description: Blog post content/description
 *           example: "در این مقاله به بررسی ساختار پروژه‌های فول‌استک می‌پردازیم..."
 *         img:
 *           type: string
 *           description: Image URL or icon name for the blog post
 *           example: "mern-banner.jpg"
 *         date:
 *           type: string
 *           description: Publication date
 *           example: "2026-08-15"
 *         __v:
 *           type: integer
 *           description: Version key
 *           example: 0
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
 *           example: "توسعه وب با MERN Stack"
 *         description:
 *           type: string
 *           example: "در این مقاله به بررسی ساختار پروژه‌های فول‌استک می‌پردازیم..."
 *         img:
 *           type: string
 *           example: "mern-banner.jpg"
 *         date:
 *           type: string
 *           example: "2026-08-15"
 *     BlogResponse:
 *       type: object
 *       properties:
 *       success:
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
 *   - name: Blog
 *     description: Blog Management Endpoints (Powered by Vanta-API)
 */

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Retrieve all blog posts with advanced Vanta-API features
 *     tags: [Blog]
 *     description: |
 *       Fetch a list of blog posts with full support for Vanta-API advanced querying features.
 *       
 *       ### 💡 Important: Dynamic Query Keys
 *       The parameter fields shown below (like `title[regex]` or `date[gte]`) are **DYNAMIC**. 
 *       We used `title` and `date` in the Swagger form just so you can easily test them. In your actual frontend code, **you can replace them with any field name from the model** (e.g., `description[regex]=...`).
 *       
 *       ---
 *       
 *       ### Frontend Developer Guide
 *       
 *       1. Global Search (q):
 *          - Description: Performs a case-insensitive text search across all indexed string fields in the database schema.
 *          - Example: /api/blog?q=React
 *       
 *       2. Pagination (page and limit):
 *          - Description: Splits large data sets into smaller chunks to optimize client rendering.
 *          - Example: /api/blog?page=2&limit=5
 *       
 *       3. Field Limiting (fields):
 *          - Description: Projection operator to include specific fields, or exclude unneeded fields by adding a minus (-) prefix.
 *          - Example (Include): /api/blog?fields=title,date
 *          - Example (Exclude): /api/blog?fields=-description
 *       
 *       4. Sorting (sort):
 *          - Description: Orders records by one or multiple fields. Add a minus (-) prefix for descending order.
 *          - Example: /api/blog?sort=-date
 *       
 *       5. Entity Population (populate):
 *          - Description: Replaces referenced MongoDB ObjectIds with their fully populated target documents.
 *          - Example: /api/blog?populate=author,comments
 *       
 *       6. Flexible Regex Filtering ([regex]):
 *          - Description: Powerful pattern matching on string fields. It is NOT limited to prefixes; it supports standard regex patterns including substrings, start/end anchors (^, $), and OR logic (|).
 *          - Example (Substring Match): /api/blog?title[regex]=توسعه
 *          - Example (Starts With / Prefix): /api/blog?title[regex]=^توسعه
 *          - Example (Ends With / Suffix): /api/blog?title[regex]=Stack$
 *          - Example (Multiple Choices / OR): /api/blog?title[regex]=React|Node
 *       
 *       7. Range Comparisons (gte, lte, gt, lt):
 *          - Description: Boundary filtering for numeric or date fields using standard relational operators (greater than [gt], greater than or equal to [gte], less than [lt], less than or equal to [lte]).
 *          - Example: /api/blog?date[gte]=2026-01-01&date[lte]=2026-12-31
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Global search query across searchable text fields"
 *         example: "React"
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
 *         example: "title,date"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Comma-separated list of relational fields to populate"
 *         example: "author,comments"
 *       - in: query
 *         name: "title[regex]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'title' is just an example! You can replace it with ANY text field (e.g., description[regex]). Regex search. Supports standard patterns (^, $, |)"
 *         example: "^توسعه"
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
 *         description: Successfully retrieved the list of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogListResponse'
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
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     description: Create a new blog post. Requires admin privileges and Bearer token.
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
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogResponse'
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
 *                   message: "مقاله‌ای با این عنوان قبلاً ثبت شده است"
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
 * /api/blog/{id}:
 *   get:
 *     summary: Get a specific blog post by ID
 *     tags: [Blog]
 *     description: |
 *       Retrieve detailed information of a single blog post using its MongoDB ObjectId.
 *       
 *       ### Frontend Developer Guide
 *       Even when fetching a single document by ID, you can use Vanta-API features:
 *       
 *       1. Field Selection (fields):
 *          - Description: Fetch only the exact fields you need from this specific post.
 *          - Example: /api/blog/64a2b3c4d5e6f7a8b9c0d1e2?fields=title,date
 *       
 *       2. Entity Population (populate):
 *          - Description: Expand references into full objects inside this specific post.
 *          - Example: /api/blog/64a2b3c4d5e6f7a8b9c0d1e2?populate=author
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the blog post
 *         example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Comma-separated list of fields to include or exclude"
 *         example: "title,date"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Comma-separated list of relational fields to populate"
 *         example: "author,comments"
 *     responses:
 *       200:
 *         description: Blog post fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 title: "توسعه وب با MERN Stack"
 *                 description: "در این مقاله به بررسی ساختار پروژه‌های فول‌استک می‌پردازیم..."
 *                 img: "mern-banner.jpg"
 *                 date: "2026-08-15"
 *                 __v: 0
 *       404:
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "مقاله یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update an existing blog post
 *     tags: [Blog]
 *     description: Update specific fields of a blog post. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the blog post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "توسعه وب با MERN Stack (نسخه جدید)"
 *               description:
 *                 type: string
 *                 example: "توضیحات آپدیت شده..."
 *               img:
 *                 type: string
 *                 example: "new-banner.jpg"
 *               date:
 *                 type: string
 *                 example: "2026-08-20"
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogResponse'
 *             example:
 *               success: true
 *               message: "مقاله با موفقیت بروزرسانی شد"
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 title: "توسعه وب با MERN Stack (نسخه جدید)"
 *                 description: "توضیحات آپدیت شده..."
 *                 img: "new-banner.jpg"
 *                 date: "2026-08-20"
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
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "مقاله یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Blog]
 *     description: Permanently remove a blog post from the database. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the blog post to delete
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
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
 *                   example: "مقاله با موفقیت حذف شد"
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
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "مقاله یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */