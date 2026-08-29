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
 *           example: "Ali Ahmadi"
 *         content:
 *           type: string
 *           description: The comment text
 *           example: "This article was very useful and practical, thanks!"
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
 *           example: "Ali Ahmadi"
 *         content:
 *           type: string
 *           example: "This article was very useful and practical, thanks!"
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
 *           example: "Comment submitted successfully"
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
 *   - name: Comments
 *     description: Comment Management Endpoints 
 */

/**
 * @swagger
 * /api/comment:
 *   get:
 *     summary: Retrieve all comments with advanced features
 *     tags: [Comments]
 *     description: "Retrieve the list of records with filtering, pagination, and advanced search ."
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Search text"
 *         example: "Excellent"
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
 *         example: "-createdAt"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Select fields"
 *         example: "author,content"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Populate relations"
 *         example: "user"
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
 *               message: "Server error occurred"
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
 *               message: "Comment submitted successfully"
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 author: "Ali Ahmadi"
 *                 content: "This article was very useful and practical, thanks!"
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
 *               message: "Author name is required"
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
 * /api/comment/{id}:
 *   get:
 *     summary: Get a specific comment by ID
 *     tags: [Comments]
 *     description: "Get the details of a specific record."
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
 *         description: "Select fields"
 *         example: "author,content"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Populate relations"
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
 *                 author: "Ali Ahmadi"
 *                 content: "This article was very useful and practical, thanks!"
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
 *               message: "Comment not found"
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
 *                 example: "Ali Ahmadi ((Updated))"
 *               content:
 *                 type: string
 *                 example: "Comment text edited..."
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
 *               message: "Comment updated successfully"
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 author: "Ali Ahmadi ((Updated))"
 *                 content: "Comment text edited..."
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
 *               message: "Author name cannot be empty"
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
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Comment not found"
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
 *                   example: "Comment deleted successfully"
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
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Comment not found"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */