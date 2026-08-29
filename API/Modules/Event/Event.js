import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./EventCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import { createEventValidator, updateEventValidator } from "./EventValidation.js";

const eventRouter = Router();

eventRouter.route("/")
  .get(getAll)
  .post(IsLogin, IsAdmin, validateRequest(createEventValidator), create);

eventRouter.route("/:id")
  .get(getOne)
  .patch(IsLogin, IsAdmin, validateRequest(updateEventValidator), update)
  .delete(IsLogin, IsAdmin, remove);

export default eventRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - date
 *         - description
 *         - branch
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *         title:
 *           type: string
 *           description: Event title
 *           example: "Scientific Research Festival"
 *         type:
 *           type: string
 *           description: Event type
 *           example: "Competition"
 *         date:
 *           type: string
 *           description: Event date
 *           example: "2026-09-10"
 *         description:
 *           type: string
 *           description: Event description
 *           example: "Full description about the event..."
 *         branch:
 *           type: array
 *           items:
 *             type: string
 *           description: School branch (Girls or Boys)
 *           example: "Girls"
 *         __v:
 *           type: integer
 *           description: Version key
 *           example: 0
 *     EventInput:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - date
 *         - description
 *         - branch
 *       properties:
 *         title:
 *           type: string
 *           example: "Scientific Research Festival"
 *         type:
 *           type: string
 *           example: "Competition"
 *         date:
 *           type: string
 *           example: "2026-09-10"
 *         description:
 *           type: string
 *           example: "Full description about the event..."
 *         branch:
 *           type: array
 *           items:
 *             type: string
 *           example: "Girls"
 *     EventResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Event created successfully"
 *         data:
 *           $ref: '#/components/schemas/Event'
 *     EventListResponse:
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
 *             $ref: '#/components/schemas/Event'
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
 *   - name: Events
 *     description: Event Management Endpoints 
 */

/**
 * @swagger
 * /api/event:
 *   get:
 *     summary: Retrieve all events with advanced features
 *     tags: [Events]
 *     description: "Retrieve the list of records with filtering, pagination, and advanced search ."
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Search text"
 *         example: "Festival"
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
 *         example: "title,branch"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Populate relations"
 *         example: "author"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of events
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventListResponse'
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
 *     summary: Create a new event
 *     tags: [Events]
 *     description: Create a new event. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *               example:
 *                 success: true
 *                 message: "Event created successfully"
 *                 data:
 *                   _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                   title: "Scientific Research Festival"
 *                   type: "Competition"
 *                   date: "2026-09-10"
 *                   description: "Full description about the event..."
 *                   branch: "Girls"
 *                   __v: 0
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
 *                   message: "An event with this title is already registered"
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
 * /api/event/{id}:
 *   get:
 *     summary: Get a specific event by ID
 *     tags: [Events]
 *     description: "Get the details of a specific record."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event
 *         example: "64a2b3c4d5e6f7a8b9c0d1e2"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Select fields"
 *         example: "title,branch"
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: "Populate relations"
 *     responses:
 *       200:
 *         description: Event fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 title: "Scientific Research Festival"
 *                 type: "Competition"
 *                 date: "2026-09-10"
 *                 description: "Full description about the event..."
 *                 branch: "Girls"
 *                 __v: 0
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Event not found"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update an existing event
 *     tags: [Events]
 *     description: Update specific fields of an event. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Scientific Research Festival ((New Version))"
 *               type:
 *                 type: string
 *                 example: "Competition"
 *               date:
 *                 type: string
 *                 example: "2026-09-15"
 *               description:
 *                 type: string
 *                 example: "Updated description..."
 *               branch:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: "Boys"
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *             example:
 *               success: true
 *               message: "Event updated successfully"
 *               data:
 *                 _id: "64a2b3c4d5e6f7a8b9c0d1e2"
 *                 title: "Scientific Research Festival ((New Version))"
 *                 type: "Competition"
 *                 date: "2026-09-15"
 *                 description: "Updated description..."
 *                 branch: "Boys"
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
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Event not found"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     description: Permanently remove an event from the database. Requires admin privileges and Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
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
 *                   example: "Event deleted successfully"
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
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Event not found"
 *               statusCode: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */