import { Router } from "express";
import { create, getAll, getOne, update, remove } from "./CommentCn.js";

const commentRouter = Router();

commentRouter.route("/").get(getAll).post(create);

commentRouter.route("/:id").get(getOne).patch(update).delete(remove);

export default commentRouter;
/**
 * @swagger
 * /api/comment:
 *   get:
 *     summary: Get all comments
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: Successfully fetched all comments
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
 *                     $ref: '#/components/schemas/Comment'
 *   post:
 *     summary: Create a new comment
 *     tags:
 *       - Comments
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
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Missing fields (author, content, role, gender)
 * /api/comment/{id}:
 *   get:
 *     summary: Get a single comment by ID
 *     tags:
 *       - Comments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *   patch:
 *     summary: Update a comment
 *     tags:
 *       - Comments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       403:
 *         description: Unauthorized (role check)
 *   delete:
 *     summary: Delete a comment
 *     tags:
 *       - Comments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       403:
 *         description: Unauthorized (role check)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         author:
 *           type: string
 *           example: "John Doe"
 *         content:
 *           type: string
 *           example: "This is a comment."
 *         role:
 *           type: string
 *           example: "user"
 *         gender:
 *           type: string
 *           example: "male"
 *     CommentInput:
 *       type: object
 *       properties:
 *         author:
 *           type: string
 *           example: "John Doe"
 *         content:
 *           type: string
 *           example: "This is a comment."
 *         role:
 *           type: string
 *           example: "user"
 *         gender:
 *           type: string
 *           example: "male"
 */
