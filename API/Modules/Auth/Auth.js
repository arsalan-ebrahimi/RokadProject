import { Router } from "express";
import {
  auth,
  forgetPassword,
  loginWithOtp,
  loginWithPassword,
  resendCode,
} from "./AuthCn.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import { authValidator, forgetPasswordValidator, loginWithOtpValidator, loginWithPasswordValidator, resendCodeValidator } from "./AuthValidator.js";
const authRouter = Router();
authRouter.route("/").post(authValidator, handleValidationErrors, auth);
authRouter.route("/login-password").post(loginWithPasswordValidator, handleValidationErrors, loginWithPassword);
authRouter.route("/login-otp").post(loginWithOtpValidator, handleValidationErrors, loginWithOtp);
authRouter.route("/resend-code").post(resendCodeValidator, handleValidationErrors, resendCode);
authRouter.route("/forget-password").post(forgetPasswordValidator, handleValidationErrors, forgetPassword);

export default authRouter;
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & Authorization system
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthRequest:
 *       type: object
 *       properties:
 *         phoneNumber:
 *           type: string
 *
 *     LoginWithPasswordDTO:
 *       type: object
 *       properties:
 *         phoneNumber:
 *           type: string
 *         password:
 *           type: string
 *
 *     LoginWithOtpDTO:
 *       type: object
 *       properties:
 *         phoneNumber:
 *           type: string
 *         code:
 *           type: string
 *
 *     ResendCodeDTO:
 *       type: object
 *       properties:
 *         phoneNumber:
 *           type: string
 *
 *     ForgetPasswordDTO:
 *       type: object
 *       properties:
 *         phoneNumber:
 *           type: string
 *         code:
 *           type: string
 *         newPassword:
 *           type: string
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             user:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 role:
 *                   type: string
 *                 birthDate:
 *                   type: string
 *                   format: date
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Start authentication (send OTP or detect password user)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       200:
 *         description: OTP sent or user found.
 */

/**
 * @swagger
 * /api/auth/login-password:
 *   post:
 *     summary: Login with password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginWithPasswordDTO'
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Incorrect password
 */

/**
 * @swagger
 * /api/auth/login-otp:
 *   post:
 *     summary: Login with OTP code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginWithOtpDTO'
 *     responses:
 *       200:
 *         description: Logged in successfully (new user auto-created)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 */

/**
 * @swagger
 * /api/auth/resend-code:
 *   post:
 *     summary: Resend OTP code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendCodeDTO'
 *     responses:
 *       200:
 *         description: OTP sent again
 */

/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: Reset password using OTP code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetPasswordDTO'
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
