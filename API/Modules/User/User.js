import { Router } from "express";
import { getAll, getOne, update } from "./UserCn.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import IsLogin from "../../Middleware/IsLogin.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import { updateUserValidator } from "./UserValidation.js";

const userRouter = Router();

userRouter.route('/')
  .get(IsAdmin, getAll);
  
userRouter.route('/:id')
  .get(IsLogin, getOne)
  .patch(IsLogin, validateRequest(updateUserValidator), update);

export default userRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *         fullName:
 *           type: string
 *           description: User full name
 *           example: "علی محمدی"
 *         phoneNumber:
 *           type: string
 *           description: User phone number (Iranian format)
 *           example: "09123456789"
 *         birthDate:
 *           type: string
 *           description: User birth date
 *           example: "1375/05/20"
 *         role:
 *           type: string
 *           enum: [user, admin, superAdmin]
 *           description: User role level
 *           example: "user"
 *         __v:
 *           type: integer
 *           description: Version key
 *           example: 0
 *     UserInput:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: "علی محمدی"
 *         password:
 *           type: string
 *           example: "secret123"
 *         birthDate:
 *           type: string
 *           example: "1375/05/20"
 *         role:
 *           type: string
 *           enum: [user, admin, superAdmin]
 *           example: "admin"
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "اطلاعات کاربر با موفقیت بروزرسانی شد"
 *         data:
 *           $ref: '#/components/schemas/User'
 *     UserListResponse:
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
 *             $ref: '#/components/schemas/User'
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
 *   - name: Users
 *     description: User Management Endpoints (Powered by Vanta-API)
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Retrieve all users (Admin only)
 *     tags: [Users]
 *     description: |
 *       Fetch a list of users with full support for Vanta-API advanced querying features. Requires Admin role and Bearer token.
 *       
 *       ### 💡 Important: Dynamic Query Keys
 *       The parameter fields shown below (like `fullName[regex]` or `phoneNumber[gte]`) are **DYNAMIC**. 
 *       We used `fullName` and `phoneNumber` in the Swagger form just so you can easily test them. In your actual frontend code, **you can replace them with any field name from the model** (e.g., `role[regex]=...`).
 *       
 *       ---
 *       
 *       ### Frontend Developer Guide
 *       
 *       1. Global Search (q):
 *          - Description: Performs a case-insensitive text search across all indexed string fields in the database schema.
 *          - Example: /api/user?q=محمدی
 *       
 *       2. Pagination (page and limit):
 *          - Description: Splits large data sets into smaller chunks to optimize client rendering.
 *          - Example: /api/user?page=2&limit=5
 *       
 *       3. Field Limiting (fields):
 *          - Description: Projection operator to include specific fields, or exclude unneeded fields by adding a minus (-) prefix.
 *          - Example (Include): /api/user?fields=fullName,phoneNumber
 *          - Example (Exclude): /api/user?fields=-role
 *       
 *       4. Sorting (sort):
 *          - Description: Orders records by one or multiple fields. Add a minus (-) prefix for descending order.
 *          - Example: /api/user?sort=-phoneNumber
 *       
 *       5. Entity Population (populate):
 *          - Description: Replaces referenced MongoDB ObjectIds with their fully populated target documents.
 *          - Example: /api/user?populate=favoriteProducts
 *       
 *       6. Flexible Regex Filtering ([regex]):
 *          - Description: Powerful pattern matching on string fields. It is NOT limited to prefixes; it supports standard regex patterns including substrings, start/end anchors (^, $), and OR logic (|).
 *          - Example (Substring Match): /api/user?fullName[regex]=محمدی
 *          - Example (Starts With / Prefix): /api/user?fullName[regex]=^علی
 *          - Example (Ends With / Suffix): /api/user?phoneNumber[regex]=789$
 *          - Example (Multiple Choices / OR): /api/user?role[regex]=admin|superAdmin
 *       
 *       7. Range Comparisons (gte, lte, gt, lt):
 *          - Description: Boundary filtering for numeric or string fields using standard relational operators (greater than [gt], greater than or equal to [gte], less than [lt], less than or equal to [lte]).
 *          - Example: /api/user?phoneNumber[gte]=09100000000&phoneNumber[lte]=09199999999
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Global search query across searchable text fields"
 *         example: "محمدی"
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
 *         example: "-phoneNumber"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Comma-separated list of fields to include or exclude"
 *         example: "fullName,phoneNumber"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Comma-separated list of relational fields to populate"
 *         example: "favoriteProducts"
 *       - in: query
 *         name: "fullName[regex]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'fullName' is just an example! You can replace it with ANY text field. Regex search. Supports standard patterns (^, $, |)"
 *         example: "^علی"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       401:
 *         description: Unauthorized (User not logged in)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (User does not have admin role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get a specific user by ID (or own profile if regular user)
 *     tags: [Users]
 *     description: |
 *       Retrieve detailed information of a user. Regular users can only access their own profile. Requires authentication.
 *       
 *       ### Frontend Developer Guide
 *       Even when fetching a single user profile, you can use Vanta-API features:
 *       
 *       1. Field Selection (fields):
 *          - Description: Fetch only the exact fields you need.
 *          - Example: /api/user/64a2b3c4d5e6f7a8b9c0d1e2?fields=fullName,phoneNumber
 *       
 *       2. Entity Population (populate):
 *          - Description: Expand references into full objects (e.g., favoriteProducts, boughtProducts, cartId).
 *          - Example: /api/user/64a2b3c4d5e6f7a8b9c0d1e2?populate=favoriteProducts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user (Ignored for regular users as they fetch their own profile)
 *         example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Comma-separated list of fields to include or exclude"
 *         example: "fullName,phoneNumber"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Comma-separated list of relational fields to populate"
 *         example: "favoriteProducts,boughtProducts"
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized (User not logged in)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "کاربر یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update user profile or data
 *     tags: [Users]
 *     description: Updates specific fields of a user. Regular users can only update their own profile; superAdmins can also change roles. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "علی محمدی (ویرایش‌شده)"
 *               password:
 *                 type: string
 *                 example: "newSecret456"
 *               birthDate:
 *                 type: string
 *                 example: "1375/05/20"
 *               role:
 *                 type: string
 *                 enum: [user, admin, superAdmin]
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               success: true
 *               message: "اطلاعات کاربر با موفقیت بروزرسانی شد"
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "رمز عبور باید حداقل ۶ کاراکتر باشد"
 *               statusCode: 400
 *       401:
 *         description: Unauthorized (User not logged in)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (Not authorized to edit this user)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "شما مجاز به ویرایش اطلاعات این کاربر نیستید"
 *               statusCode: 403
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "کاربر یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */