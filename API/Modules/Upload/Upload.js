import express from "express";
import { removeData, uploadMultiple, uploadSingle } from "./UploadCn.js";
import upload from "../../Utils/Upload.js";

const uploadRouter = express.Router();
uploadRouter.route("/").post(upload.single("file"), uploadSingle);
uploadRouter.route("/multi").post(upload.array("files", 10), uploadMultiple);
uploadRouter.route("/remove").post(removeData);

export default uploadRouter;
/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload and management
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a single file
 *     description: Upload a single file to the server (admin only).
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 data:
 *                   type: string
 *                   example: filename.png
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: No file uploaded
 *
 * /api/upload/multi:
 *   post:
 *     summary: Upload multiple files
 *     description: Upload multiple files at once (admin only). Maximum 10 files.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Files uploaded successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: filename1.png
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: No files uploaded
 *
 * /api/upload/remove:
 *   post:
 *     summary: Remove a file
 *     description: Remove a file from the server by filename.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *             properties:
 *               filename:
 *                 type: string
 *                 example: filename.png
 *     responses:
 *       200:
 *         description: File removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File removed successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: File not found
 */
