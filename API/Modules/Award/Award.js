import { Router } from "express";
import { getAll, getOne, update, remove, create } from "./AwardCn.js";
import { IsLogin, IsAdmin } from "./authMiddlewares.js"; 

const awardRouter = Router();

awardRouter.route("/")
  .get(getAll) 
  .post(IsLogin, IsAdmin, create); 

awardRouter.route("/:id")
  .get(getOne) 
  .patch(IsLogin, IsAdmin, update) 
  .delete(IsLogin, IsAdmin, remove); 

export default awardRouter;

/**
 * @swagger
 * /api/award:
 *   get:
 *     summary: Get all awards
 *     tags:
 *       - Awards
 *     responses:
 *       200:
 *         description: Successfully fetched all awards
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
 *                     $ref: '#/components/schemas/Award'
 *   post:
 *     summary: Create a new award
 *     tags:
 *       - Awards
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
 *               $ref: '#/components/schemas/Award'
 *       400:
 *         description: Bad request (missing title or invalid role)
 *       403:
 *         description: Unauthorized (role check)
 * /api/award/{id}:
 *   get:
 *     summary: Get a single award by ID
 *     tags:
 *       - Awards
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Award ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the award
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Award'
 *       404:
 *         description: Award not found
 *   patch:
 *     summary: Update an award
 *     tags:
 *       - Awards
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Award ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AwardInput'
 *     responses:
 *       200:
 *         description: Award updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Award'
 *       404:
 *         description: Award not found
 *       403:
 *         description: Unauthorized (role check)
 *   delete:
 *     summary: Delete an award
 *     tags:
 *       - Awards
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Award ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Award deleted successfully
 *       404:
 *         description: Award not found
 *       403:
 *         description: Unauthorized (role check)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Award:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         title:
 *           type: string
 *           example: "Best Performer"
 *     AwardInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Best Performer"
 */