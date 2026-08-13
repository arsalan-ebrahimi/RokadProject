import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./BlogCn.js";

const blogRouter = Router();

blogRouter.route("/").get(getAll).post(create);
blogRouter.route("/:id").patch(update).delete(remove).get(getOne);

export default blogRouter;

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all blogs
 *     tags:
 *       - Blogs
 *     responses:
 *       200:
 *         description: Successfully fetched all blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *   post:
 *     summary: Create a new blog
 *     tags:
 *       - Blogs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogInput'
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Bad request (missing title or duplicate title)
 *       403:
 *         description: Unauthorized (role check)
 * /api/blog/{id}:
 *   get:
 *     summary: Get a single blog by ID
 *     tags:
 *       - Blogs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Blog ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 *   patch:
 *     summary: Update a blog
 *     tags:
 *       - Blogs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Blog ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogInput'
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 *       403:
 *         description: Unauthorized (role check)
 *   delete:
 *     summary: Delete a blog
 *     tags:
 *       - Blogs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Blog ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       404:
 *         description: Blog not found
 *       403:
 *         description: Unauthorized (role check)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         title:
 *           type: string
 *           example: "New Blog Post"
 *         description:
 *           type: string
 *           example: "This is a blog description."
 *     BlogInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "New Blog Post"
 *         description:
 *           type: string
 *           example: "This is a blog description."
 *         img:
 *           type: string
 *           example: "http://example.com/img.jpg"
 *         date:
 *           type: string
 *           example: "2026-02-25"
 */