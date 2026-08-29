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
 *           example: "Mohammad Rezaei"
 *         job:
 *           type: string
 *           description: Student current job position
 *           example: "Frontend Developer"
 *         generation:
 *           type: integer
 *           description: Student generation number
 *           example: 3
 *         major:
 *           type: string
 *           description: Major
 *         schoolType:
 *           type: string
 *           enum: [Boys, Girls]
 *           description: School type
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
 *           example: "Mohammad Rezaei"
 *         job:
 *           type: string
 *           example: "Frontend Developer"
 *         generation:
 *           type: integer
 *           example: 3
 *         major:
 *           type: string
 *           example: "Mathematics and Physics"
 *         schoolType:
 *           type: string
 *           example: "Boys"
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
 *           example: "Student registered successfully"
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
 *           example: "Error message will be displayed here"
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
 *     description: Student Management Endpoints 
 */

/**
 * @swagger
 * /api/student:
 *   get:
 *     summary: Retrieve all students with advanced features
 *     tags: [Students]
 *     description: "Retrieve the list of records with filtering, pagination, and advanced search ."
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Search text"
 *         example: "Rezaei"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Page number"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Items per page"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "Sorting"
 *         example: "-generation"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Select fields"
 *         example: "fullName,job"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Populate relations"
 *         example: "awards"
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
 *               message: "Server error occurred"
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
 *               message: "Full name field is required"
 *               statusCode: 400
 *       401:
 *         description: Unauthorized (User not logged in)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Please log in to your account first"
 *               statusCode: 401
 *       403:
 *         description: Forbidden (User does not have admin role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "You are not authorized to perform this operation"
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
 *     description: "Get the details of a specific record."
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
 *         description: "Select fields"
 *         example: "fullName,job"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Populate relations"
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
 *                 fullName: "Mohammad Rezaei"
 *                 job: "Frontend Developer"
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
 *               message: "Student not found"
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
 *                 example: "Mohammad Rezaei ((Updated))"
 *               job:
 *                 type: string
 *                 example: "Full-stack Developer"
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
 *               message: "Student information updated successfully"
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 fullName: "Mohammad Rezaei ((Updated))"
 *                 job: "Full-stack Developer"
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
 *               message: "Full name must be a string"
 *               statusCode: 400
 *       401:
 *         description: Unauthorized (User not logged in)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Please log in to your account first"
 *               statusCode: 401
 *       403:
 *         description: Forbidden (User does not have admin role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "You are not authorized to perform this operation"
 *               statusCode: 403
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Student not found"
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
 *                   example: "Student deleted successfully"
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
 *               message: "Please log in to your account first"
 *               statusCode: 401
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "You are not authorized to perform this operation"
 *               statusCode: 403
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Student not found"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */