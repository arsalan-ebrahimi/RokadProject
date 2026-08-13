import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./EnrollmentCn.js";

const enrollmentRouter = Router();

enrollmentRouter.route("/").get(getAll).post(create);
enrollmentRouter.route("/:id").get(getOne).patch(update).delete(remove);

export default enrollmentRouter;
/**
 * @swagger
 * /api/enrollment:
 *   get:
 *     summary: Get all enrollments
 *     tags:
 *       - Enrollments
 *     responses:
 *       200:
 *         description: Successfully fetched all enrollments
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
 *                     $ref: '#/components/schemas/Enrollment'
 *   post:
 *     summary: Create a new enrollment
 *     tags:
 *       - Enrollments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnrollmentInput'
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: National code already exists
 *       403:
 *         description: Unauthorized (role check)
 * /api/enrollment/{id}:
 *   get:
 *     summary: Get a single enrollment by ID
 *     tags:
 *       - Enrollments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Enrollment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the enrollment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Enrollment not found
 *   patch:
 *     summary: Update an enrollment
 *     tags:
 *       - Enrollments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Enrollment ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnrollmentInput'
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Enrollment not found
 *       403:
 *         description: Unauthorized (role check)
 *   delete:
 *     summary: Delete an enrollment
 *     tags:
 *       - Enrollments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Enrollment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *       404:
 *         description: Enrollment not found
 *       403:
 *         description: Unauthorized (role check)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         nationalCode:
 *           type: string
 *           example: "123456789"
 *         grade:
 *           type: string
 *           example: "10"
 *     EnrollmentInput:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         nationalCode:
 *           type: string
 *           example: "123456789"
 *         grade:
 *           type: string
 *           example: "10"
 *         schoolType:
 *           type: string
 *           example: "Public"
 *         major:
 *           type: string
 *           example: "Mathematics"
 */
