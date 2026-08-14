import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./CommentCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import { createCommentValidator, updateCommentValidator } from "./CommentValidation.js";

const commentRouter = Router();

commentRouter.route("/")
  .get(getAll)
  .post(IsLogin, IsAdmin, validateRequest(createCommentValidator), create);

commentRouter.route("/:id")
  .get(getOne)
  .patch(IsLogin, IsAdmin, validateRequest(updateCommentValidator), update)
  .delete(IsLogin, IsAdmin, remove);

export default commentRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - author
 *         - content
 *         - role
 *         - img
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *         author:
 *           type: string
 *           description: Name of the comment author
 *           example: "علی احمدی"
 *         content:
 *           type: string
 *           description: The comment text
 *           example: "این مقاله بسیار مفید و کاربردی بود، ممنون!"
 *         role:
 *           type: string
 *           description: Role of the author (e.g., user, admin)
 *           example: "user"
 *         img:
 *           type: string
 *           description: Profile image or icon filename
 *           example: "avatar-user.png"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date of the comment
 *           example: "2026-08-15T14:48:00.000Z"
 *         __v:
 *           type: integer
 *           description: Version key
 *           example: 0
 *     CommentInput:
 *       type: object
 *       required:
 *         - author
 *         - content
 *         - role
 *         - img
 *       properties:
 *         author:
 *           type: string
 *           example: "علی احمدی"
 *         content:
 *           type: string
 *           example: "این مقاله بسیار مفید و کاربردی بود، ممنون!"
 *         role:
 *           type: string
 *           example: "user"
 *         img:
 *           type: string
 *           example: "avatar-user.png"
 *     CommentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "نظر با موفقیت ثبت شد"
 *         data:
 *           $ref: '#/components/schemas/Comment'
 *     CommentListResponse:
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
 *             $ref: '#/components/schemas/Comment'
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
 *   - name: Comments
 *     description: Comment Management Endpoints (Powered by Vanta-API)
 */

/**
 * @swagger
 * /api/comment:
 *   get:
 *     summary: Retrieve all comments with advanced Vanta-API features
 *     tags: [Comments]
 *     description: |
 *       Fetch a list of comments with full support for Vanta-API advanced querying features.
 *       
 *       ### 💡 Important: Dynamic Query Keys
 *       The parameter fields shown below (like `author[regex]` or `createdAt[gte]`) are **DYNAMIC**. 
 *       We used `author` and `createdAt` in the Swagger form just so you can easily test them. In your actual frontend code, **you can replace them with any field name from the model** (e.g., `content[regex]=...` or `role[regex]=...`).
 *       
 *       ---
 *       
 *       ### Frontend Developer Guide
 *       
 *       1. Global Search (q):
 *          - Description: Performs a case-insensitive text search across all indexed string fields in the database schema.
 *          - Example: /api/comment?q=عالی
 *       
 *       2. Pagination (page and limit):
 *          - Description: Splits large data sets into smaller chunks to optimize client rendering.
 *          - Example: /api/comment?page=2&limit=5
 *       
 *       3. Field Limiting (fields):
 *          - Description: Projection operator to include specific fields, or exclude unneeded fields by adding a minus (-) prefix.
 *          - Example (Include): /api/comment?fields=author,content
 *          - Example (Exclude): /api/comment?fields=-createdAt
 *       
 *       4. Sorting (sort):
 *          - Description: Orders records by one or multiple fields. Add a minus (-) prefix for descending order.
 *          - Example: /api/comment?sort=-createdAt
 *       
 *       5. Entity Population (populate):
 *          - Description: Replaces referenced MongoDB ObjectIds with their fully populated target documents.
 *          - Example: /api/comment?populate=post
 *       
 *       6. Flexible Regex Filtering ([regex]):
 *          - Description: Powerful pattern matching on string fields. It is NOT limited to prefixes; it supports standard regex patterns including substrings, start/end anchors (^, $), and OR logic (|).
 *          - Example (Substring Match): /api/comment?author[regex]=احمدی
 *          - Example (Starts With / Prefix): /api/comment?author[regex]=^علی
 *          - Example (Ends With / Suffix): /api/comment?role[regex]=user$
 *          - Example (Multiple Choices / OR): /api/comment?role[regex]=user|admin
 *       
 *       7. Range Comparisons (gte, lte, gt, lt):
 *          - Description: Boundary filtering for numeric or date fields using standard relational operators (greater than [gt], greater than or equal to [gte], less than [lt], less than or equal to [lte]).
 *          - Example: /api/comment?createdAt[gte]=2026-01-01&createdAt[lte]=2026-12-31
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Global search query across searchable text fields"
 *         example: "عالی"
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
 *         example: "-createdAt"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Comma-separated list of fields to include or exclude"
 *         example: "author,content"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Comma-separated list of relational fields to populate"
 *         example: "user"
 *       - in: query
 *         name: "author[regex]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'author' is just an example! You can replace it with ANY text field (e.g., content[regex]). Regex search. Supports standard patterns (^, $, |)"
 *         example: "^علی"
 *       - in: query
 *         name: "createdAt[gte]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'createdAt' is just an example! You can apply [gte] to ANY date/number field. Lower boundary filter (greater than or equal to [gte])"
 *         example: "2026-01-01"
 *       - in: query
 *         name: "createdAt[gt]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'createdAt' is just an example! Strict lower boundary filter (greater than [gt])"
 *       - in: query
 *         name: "createdAt[lte]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'createdAt' is just an example! Upper boundary filter (less than or equal to [lte])"
 *         example: "2026-12-31"
 *       - in: query
 *         name: "createdAt[lt]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'createdAt' is just an example! Strict upper boundary filter (less than [lt])"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of comments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentListResponse'
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
 *     summary: Create a new comment
 *     tags: [Comments]
 *     description: Create a new comment. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *             example:
 *               success: true
 *               message: "نظر با موفقیت ثبت شد"
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 author: "علی احمدی"
 *                 content: "این مقاله بسیار مفید و کاربردی بود، ممنون!"
 *                 role: "user"
 *                 img: "avatar-user.png"
 *                 createdAt: "2026-08-15T14:48:00.000Z"
 *                 __v: 0
 *       400:
 *         description: Bad Request (Validation Error)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "نام نویسنده الزامی است"
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
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/comment/{id}:
 *   get:
 *     summary: Get a specific comment by ID
 *     tags: [Comments]
 *     description: |
 *       Retrieve detailed information of a single comment using its MongoDB ObjectId.
 *       
 *       ### Frontend Developer Guide
 *       Even when fetching a single document by ID, you can use Vanta-API features:
 *       
 *       1. Field Selection (fields):
 *          - Description: Fetch only the exact fields you need from this specific comment.
 *          - Example: /api/comment/64a2b3c4d5e6f7a8b9c0d1e2?fields=author,content
 *       
 *       2. Entity Population (populate):
 *          - Description: Expand references into full objects inside this specific comment.
 *          - Example: /api/comment/64a2b3c4d5e6f7a8b9c0d1e2?populate=user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment
 *         example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Comma-separated list of fields to include or exclude"
 *         example: "author,content"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Comma-separated list of relational fields to populate"
 *     responses:
 *       200:
 *         description: Comment fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 author: "علی احمدی"
 *                 content: "این مقاله بسیار مفید و کاربردی بود، ممنون!"
 *                 role: "user"
 *                 img: "avatar-user.png"
 *                 createdAt: "2026-08-15T14:48:00.000Z"
 *                 __v: 0
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "نظر یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update an existing comment
 *     tags: [Comments]
 *     description: Update specific fields of a comment. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *                 example: "علی احمدی (بروزرسانی شده)"
 *               content:
 *                 type: string
 *                 example: "متن نظر ویرایش شد..."
 *               role:
 *                 type: string
 *                 example: "admin"
 *               img:
 *                 type: string
 *                 example: "new-avatar.png"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *             example:
 *               success: true
 *               message: "نظر با موفقیت بروزرسانی شد"
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 author: "علی احمدی (بروزرسانی شده)"
 *                 content: "متن نظر ویرایش شد..."
 *                 role: "admin"
 *                 img: "new-avatar.png"
 *                 createdAt: "2026-08-15T14:48:00.000Z"
 *                 __v: 0
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "نام نویسنده نمی‌تواند خالی باشد"
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
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "نظر یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     description: Permanently remove a comment from the database. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
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
 *                   example: "نظر با موفقیت حذف شد"
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
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "نظر یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */