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
 *         type:
 *           type: string
 *           description: Type of social media (e.g., github, linkedin)
 *           example: "github"
 *         link:
 *           type: string
 *           description: URL of the social profile
 *           example: "https://github.com/example"
 *     Student:
 *       type: object
 *       required:
 *         - fullName
 *         - job
 *         - generation
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *         fullName:
 *           type: string
 *           description: Student full name
 *           example: "محمد رضایی"
 *         job:
 *           type: string
 *           description: Student current job position
 *           example: "فرانت‌اند دولوپر"
 *         generation:
 *           type: integer
 *           description: Student generation number
 *           example: 3
 *         socialLinks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SocialLink'
 *           description: Array of social media links
 *         __v:
 *           type: integer
 *           description: Version key
 *           example: 0
 *     StudentInput:
 *       type: object
 *       required:
 *         - fullName
 *         - job
 *         - generation
 *       properties:
 *         fullName:
 *           type: string
 *           example: "محمد رضایی"
 *         job:
 *           type: string
 *           example: "فرانت‌اند دولوپر"
 *         generation:
 *           type: integer
 *           example: 3
 *         socialLinks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SocialLink'
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
 *   - name: Students
 *     description: Student Management Endpoints (Powered by Vanta-API)
 */

/**
 * @swagger
 * /api/student:
 *   get:
 *     summary: Retrieve all students with advanced Vanta-API features
 *     tags: [Students]
 *     description: |
 *       Fetch a list of students with full support for Vanta-API advanced querying features.
 *       
 *       ### 💡 Important: Dynamic Query Keys
 *       The parameter fields shown below (like `fullName[regex]` or `generation[gte]`) are **DYNAMIC**. 
 *       We used `fullName` and `generation` in the Swagger form just so you can easily test them. In your actual frontend code, **you can replace them with any field name from the model** (e.g., `job[regex]=...`).
 *       
 *       ---
 *       
 *       ### Frontend Developer Guide
 *       
 *       1. Global Search (q):
 *          - Description: Performs a case-insensitive text search across all indexed string fields in the database schema.
 *          - Example: /api/student?q=رضایی
 *       
 *       2. Pagination (page and limit):
 *          - Description: Splits large data sets into smaller chunks to optimize client rendering.
 *          - Example: /api/student?page=2&limit=5
 *       
 *       3. Field Limiting (fields):
 *          - Description: Projection operator to include specific fields, or exclude unneeded fields by adding a minus (-) prefix.
 *          - Example (Include): /api/student?fields=fullName,job
 *          - Example (Exclude): /api/student?fields=-socialLinks
 *       
 *       4. Sorting (sort):
 *          - Description: Orders records by one or multiple fields. Add a minus (-) prefix for descending order.
 *          - Example: /api/student?sort=-generation
 *       
 *       5. Entity Population (populate):
 *          - Description: Replaces referenced MongoDB ObjectIds with their fully populated target documents.
 *          - Example: /api/student?populate=awards
 *       
 *       6. Flexible Regex Filtering ([regex]):
 *          - Description: Powerful pattern matching on string fields. It is NOT limited to prefixes; it supports standard regex patterns including substrings, start/end anchors (^, $), and OR logic (|).
 *          - Example (Substring Match): /api/student?fullName[regex]=رضایی
 *          - Example (Starts With / Prefix): /api/student?fullName[regex]=^محمد
 *          - Example (Ends With / Suffix): /api/student?job[regex]=دولوپر$
 *          - Example (Multiple Choices / OR): /api/student?job[regex]=فرانت‌اند|بک‌اند
 *       
 *       7. Range Comparisons (gte, lte, gt, lt):
 *          - Description: Boundary filtering for numeric fields (like generation) using standard relational operators (greater than [gt], greater than or equal to [gte], less than [lt], less than or equal to [lte]).
 *          - Example: /api/student?generation[gte]=1&generation[lte]=3
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Global search query across searchable text fields"
 *         example: "رضایی"
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
 *         example: "-generation"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Comma-separated list of fields to include or exclude"
 *         example: "fullName,job"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Comma-separated list of relational fields to populate"
 *         example: "awards"
 *       - in: query
 *         name: "fullName[regex]"
 *         schema:
 *           type: string
 *         description: "💡 DYNAMIC FIELD: 'fullName' is just an example! You can replace it with ANY text field (e.g., job[regex]). Regex search. Supports standard patterns (^, $, |)"
 *         example: "^محمد"
 *       - in: query
 *         name: "generation[gte]"
 *         schema:
 *           type: integer
 *         description: "💡 DYNAMIC FIELD: 'generation' is just an example! You can apply [gte] to ANY numeric/date field. Lower boundary filter (greater than or equal to [gte])"
 *         example: 1
 *       - in: query
 *         name: "generation[gt]"
 *         schema:
 *           type: integer
 *         description: "💡 DYNAMIC FIELD: 'generation' is just an example! Strict lower boundary filter (greater than [gt])"
 *         example: 1
 *       - in: query
 *         name: "generation[lte]"
 *         schema:
 *           type: integer
 *         description: "💡 DYNAMIC FIELD: 'generation' is just an example! Upper boundary filter (less than or equal to [lte])"
 *         example: 5
 *       - in: query
 *         name: "generation[lt]"
 *         schema:
 *           type: integer
 *         description: "💡 DYNAMIC FIELD: 'generation' is just an example! Strict upper boundary filter (less than [lt])"
 *         example: 5
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of students
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentListResponse'
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
 *     summary: Create a new student
 *     tags: [Students]
 *     description: Create a new student. Requires admin privileges and Bearer token.
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
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 *       400:
 *         description: Bad Request (Validation Error)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "فیلد نام کامل الزامی است"
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
 * /api/student/{id}:
 *   get:
 *     summary: Get a specific student by ID
 *     tags: [Students]
 *     description: |
 *       Retrieve detailed information of a single student using its MongoDB ObjectId.
 *       
 *       ### Frontend Developer Guide
 *       Even when fetching a single document by ID, you can use Vanta-API features:
 *       
 *       1. Field Selection (fields):
 *          - Description: Fetch only the exact fields you need from this specific student.
 *          - Example: /api/student/64a2b3c4d5e6f7a8b9c0d1e2?fields=fullName,job
 *       
 *       2. Entity Population (populate):
 *          - Description: Expand references into full objects inside this specific student.
 *          - Example: /api/student/64a2b3c4d5e6f7a8b9c0d1e2?populate=awards
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the student
 *         example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Comma-separated list of fields to include or exclude"
 *         example: "fullName,job"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Comma-separated list of relational fields to populate"
 *     responses:
 *       200:
 *         description: Student fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 fullName: "محمد رضایی"
 *                 job: "فرانت‌اند دولوپر"
 *                 generation: 3
 *                 socialLinks:
 *                   - type: "github"
 *                     link: "https://github.com/example"
 *                 __v: 0
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "دانش‌آموز یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update an existing student
 *     tags: [Students]
 *     description: Update specific fields of a student. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the student to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "محمد رضایی (بروزرسانی شده)"
 *               job:
 *                 type: string
 *                 example: "فول‌استک دولوپر"
 *               generation:
 *                 type: integer
 *                 example: 3
 *               socialLinks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/SocialLink'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 *             example:
 *               success: true
 *               message: "اطلاعات دانش‌آموز با موفقیت بروزرسانی شد"
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 fullName: "محمد رضایی (بروزرسانی شده)"
 *                 job: "فول‌استک دولوپر"
 *                 generation: 3
 *                 socialLinks:
 *                   - type: "github"
 *                     link: "https://github.com/example"
 *                 __v: 0
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "نام کامل باید یک متن باشد"
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
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "دانش‌آموز یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     description: Permanently remove a student from the database. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the student to delete
 *     responses:
 *       200:
 *         description: Student deleted successfully
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
 *                   example: "دانش‌آموز با موفقیت حذف شد"
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
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "دانش‌آموز یافت نشد"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */