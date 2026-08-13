import { Router } from "express";
import { getAll, getOne, update } from "./UserCn.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import IsLogin from "../../Middleware/IsLogin.js";
const userRouter = Router();
userRouter.route('/').get(IsAdmin,getAll)
userRouter.route('/:id').get(IsLogin,getOne).patch(IsLogin,update)
export default userRouter

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated user ID
 *         name:
 *           type: string
 *           description: User full name
 *         email:
 *           type: string
 *           description: User email address
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           description: User role
 *       example:
 *         id: "65f123abc456"
 *         name: "Arsalan Ebrahimi"
 *         email: "arsalan@gmail.com"
 *         role: "user"
 */
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Admin only
 */
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a specific user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */