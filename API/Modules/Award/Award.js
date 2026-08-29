import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./AwardCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import { createAwardValidator, updateAwardValidator } from "./AwardValidation.js";

const awardRouter = Router();

awardRouter.route("/")
  .get(getAll)
  .post(IsLogin, IsAdmin, validateRequest(createAwardValidator), create);

awardRouter.route("/:id")
  .get(getOne)
  .patch(IsLogin, IsAdmin, validateRequest(updateAwardValidator), update)
  .delete(IsLogin, IsAdmin, remove);

export default awardRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Award:
 *       type: object
 *       required:
 *         - title
 *         - rank
 *         - description
 *         - winners
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *         title:
 *           type: string
 *           description: Award title
 *           example: "1st Place Science Olympiad Award"
 *         rank:
 *           type: integer
 *           description: Award rank (1, 2, or 3)
 *           example: 1
 *         description:
 *           type: string
 *           description: Award content/description
 *           example: "This award is given to the student with the highest score."
 *         winners:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of Student ObjectIds
 *           example: ["64a2b3c4d5e6f7a8b9c0d1e2", "64a2b3c4d5e6f7a8b9c0d1e3"]
 *         __v:
 *           type: integer
 *           description: Version key
 *           example: 0
 *     AwardInput:
 *       type: object
 *       required:
 *         - title
 *         - rank
 *         - description
 *         - winners
 *       properties:
 *         title:
 *           type: string
 *           example: "1st Place Science Olympiad Award"
 *         rank:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "This award is given to the student with the highest score."
 *         winners:
 *           type: array
 *           items:
 *             type: string
 *           example: ["64a2b3c4d5e6f7a8b9c0d1e2"]
 *     AwardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Award created successfully"
 *         data:
 *           $ref: '#/components/schemas/Award'
 *     AwardListResponse:
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
 *             $ref: '#/components/schemas/Award'
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
 *   - name: Award
 *     description: Award Management Endpoints 
 */

/**
 * @swagger
 * /api/award:
 *   get:
 *     summary: Retrieve all awards with advanced features
 *     tags: [Award]
 *     description: "Retrieve the list of records with filtering, pagination, and advanced search ."
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Search text"
 *         example: "Olympiad"
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
 *         example: "rank"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Select fields"
 *         example: "title,rank"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Populate relations"
 *         example: "winners"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of awards
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardListResponse'
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
 *     summary: Create a new award
 *     tags: [Award]
 *     description: Create a new award. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AwardInput'
 *     responses:
 *       201:
 *         description: Award created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardResponse'
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
 *                   message: "An award with this title is already registered"
 *                   statusCode: 400
 *               ValidationError:
 *                 summary: Validation Error
 *                 value:
 *                   success: false
 *                   message: "Rank must be 1, 2, or 3"
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
 * /api/award/{id}:
 *   get:
 *     summary: Get a specific award by ID
 *     tags: [Award]
 *     description: "Get the details of a specific record."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the award
 *         example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Select fields"
 *         example: "title,rank"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Populate relations"
 *         example: "winners"
 *     responses:
 *       200:
 *         description: Award fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 title: "1st Place Science Olympiad Award"
 *                 rank: 1
 *                 description: "This award is given to the student with the highest score."
 *                 winners: ["64a2b3c4d5e6f7a8b9c0d1e2"]
 *                 __v: 0
 *       404:
 *         description: Award not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Award not found"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update an existing award
 *     tags: [Award]
 *     description: Update specific fields of an award. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the award to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "1st Place Science Olympiad Award ((New Version))"
 *               rank:
 *                 type: integer
 *                 example: 2
 *               description:
 *                 type: string
 *                 example: "Updated description..."
 *               winners:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64a2b3c4d5e6f7a8b9c0d1e2"]
 *     responses:
 *       200:
 *         description: Award updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardResponse'
 *             example:
 *               success: true
 *               message: "Award updated successfully"
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 title: "1st Place Science Olympiad Award ((New Version))"
 *                 rank: 2
 *                 description: "Updated description..."
 *                 winners: ["64a2b3c4d5e6f7a8b9c0d1e2"]
 *                 __v: 0
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Rank must be 1, 2, or 3"
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
 *         description: Award not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Award not found"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Delete an award
 *     tags: [Award]
 *     description: Permanently remove an award from the database. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the award to delete
 *     responses:
 *       200:
 *         description: Award deleted successfully
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
 *                   example: "Award deleted successfully"
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
 *         description: Award not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Award not found"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */