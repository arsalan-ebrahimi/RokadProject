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
 *           example: "Web Development with MERN Stack"
 *         description:
 *           type: string
 *           description: Blog post content/description
 *           example: "In this article, we examine the structure of full-stack projects..."
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
 *           example: "Web Development with MERN Stack"
 *         description:
 *           type: string
 *           example: "In this article, we examine the structure of full-stack projects..."
 *         img:
 *           type: string
 *           example: "mern-banner.jpg"
 *         date:
 *           type: string
 *           example: "2026-08-15"
 *     BlogResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Article created successfully"
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
 *   - name: Blog
 *     description: Blog Management Endpoints 
 */

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Retrieve all blog posts with advanced features
 *     tags: [Blog]
 *     description: "Retrieve the list of records with filtering, pagination, and advanced search ."
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Search text"
 *         example: "React"
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
 *         example: "-date"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Select fields"
 *         example: "title,date"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Populate relations"
 *         example: "author,comments"
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
 *               message: "Server error occurred"
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
 *                   message: "An article with this title is already registered"
 *                   statusCode: 400
 *               ValidationError:
 *                 summary: Validation Error
 *                 value:
 *                   success: false
 *                   message: "Title field is required"
 *                   statusCode: 400
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
 * /api/blog/{id}:
 *   get:
 *     summary: Get a specific blog post by ID
 *     tags: [Blog]
 *     description: "Get the details of a specific record."
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
 *         description: "Select fields"
 *         example: "title,date"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Populate relations"
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
 *                 title: "Web Development with MERN Stack"
 *                 description: "In this article, we examine the structure of full-stack projects..."
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
 *               message: "Article not found"
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
 *                 example: "Web Development with MERN Stack ((New Version))"
 *               description:
 *                 type: string
 *                 example: "Updated description..."
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
 *               message: "Article updated successfully"
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 title: "Web Development with MERN Stack ((New Version))"
 *                 description: "Updated description..."
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
 *               message: "Title cannot be empty"
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
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Article not found"
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
 *                   example: "Article deleted successfully"
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
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Article not found"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */