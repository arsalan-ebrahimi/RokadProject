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
 *           example: "Ali Mohammadi"
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
 *           example: "Ali Mohammadi"
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
 *           example: "User information updated successfully"
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
 *   - name: Users
 *     description: User Management Endpoints 
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Retrieve all users (Admin only)
 *     tags: [Users]
 *     description: "Retrieve the list of records with filtering, pagination, and advanced search ."
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Search text"
 *         example: "Mohammadi"
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
 *         example: "-phoneNumber"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Select fields"
 *         example: "fullName,phoneNumber"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Populate relations"
 *         example: "favoriteProducts"
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
 *     description: "Get the details of a specific record."
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
 *         description: "Select fields"
 *         example: "fullName,phoneNumber"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Populate relations"
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
 *               message: "User not found"
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
 *                 example: "Ali Mohammadi ((Edited))"
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
 *               message: "User information updated successfully"
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Password must be at least 6 characters"
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
 *               message: "You are not authorized to edit this user's info"
 *               statusCode: 403
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "User not found"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */