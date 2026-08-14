import { Router } from "express";
import {
  auth,
  forgetPassword,
  loginWithOtp,
  loginWithPassword,
  resendCode,
} from "./AuthCn.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import {
  authValidator,
  forgetPasswordValidator,
  loginWithOtpValidator,
  loginWithPasswordValidator,
  resendCodeValidator,
} from "./AuthValidation.js";

const authRouter = Router();

authRouter.route("/").post(validateRequest(authValidator), auth);
authRouter.route("/login-password").post(validateRequest(loginWithPasswordValidator), loginWithPassword);
authRouter.route("/login-otp").post(validateRequest(loginWithOtpValidator), loginWithOtp);
authRouter.route("/resend-code").post(validateRequest(resendCodeValidator), resendCode);
authRouter.route("/forget-password").post(validateRequest(forgetPasswordValidator), forgetPassword);

export default authRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           description: Iranian phone number
 *           example: "09123456789"
 *     LoginWithPasswordDTO:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - password
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         password:
 *           type: string
 *           example: "secret123"
 *     LoginWithOtpDTO:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         code:
 *           type: string
 *           example: "12345"
 *         password:
 *           type: string
 *           description: Optional password if registering or setting a new password during OTP login
 *           example: "secret123"
 *     ResendCodeDTO:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *     ForgetPasswordDTO:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *         - newPassword
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         code:
 *           type: string
 *           example: "12345"
 *         newPassword:
 *           type: string
 *           example: "newSecret123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "با موفقیت وارد شدید"
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             user:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                   example: "علی محمدی"
 *                 phoneNumber:
 *                   type: string
 *                   example: "09123456789"
 *                 role:
 *                   type: string
 *                   example: "user"
 *                 birthDate:
 *                   type: string
 *                   example: "1404 مرداد 1"
 *     AuthCheckResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "کد تایید با موفقیت ارسال شد"
 *         data:
 *           type: object
 *           properties:
 *             isNewUser:
 *               type: boolean
 *               example: false
 *             havePassword:
 *               type: boolean
 *               example: false
 *     MessageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "عملیات با موفقیت انجام شد"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "خطایی رخ داده است"
 *         statusCode:
 *           type: integer
 *           example: 400
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication & Authorization Endpoints
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Start authentication (send OTP or check password status)
 *     tags: [Auth]
 *     description: Checks if the user exists and whether they have a password set. Sends an OTP code if required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       200:
 *         description: OTP sent or user found state returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthCheckResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: SMS service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/login-password:
 *   post:
 *     summary: Login with phone number and password
 *     tags: [Auth]
 *     description: Authenticates user using their registered phone number and password. Returns a JWT token.
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
 *       400:
 *         description: Bad request (Missing password on account)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Incorrect phone number or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "شماره موبایل یا رمز عبور اشتباه است"
 *               statusCode: 401
 */

/**
 * @swagger
 * /api/auth/login-otp:
 *   post:
 *     summary: Login or Register with OTP code
 *     tags: [Auth]
 *     description: Verifies the OTP code sent to the phone. Automatically creates a new user if they don't exist. Returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginWithOtpDTO'
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid or expired OTP code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "کد تایید اشتباه یا منقضی شده است"
 *               statusCode: 400
 */

/**
 * @swagger
 * /api/auth/resend-code:
 *   post:
 *     summary: Resend OTP verification code
 *     tags: [Auth]
 *     description: Triggers a new OTP code dispatch to the specified phone number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendCodeDTO'
 *     responses:
 *       200:
 *         description: OTP sent again successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: SMS service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: Reset password using OTP code
 *     tags: [Auth]
 *     description: Verifies the OTP code and updates the user's password to a new one.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetPasswordDTO'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               success: true
 *               message: "رمز عبور با موفقیت تغییر کرد"
 *       400:
 *         description: Invalid OTP code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "کد تایید اشتباه است"
 *               statusCode: 400
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "کاربری با این شماره یافت نشد"
 *               statusCode: 404
 */