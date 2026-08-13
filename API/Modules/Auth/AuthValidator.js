import { body } from "express-validator";

export const authValidator = [
  body("phoneNumber")
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage("Invalid phone number format"),
];
export const loginWithPasswordValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage("Invalid phone number format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
export const loginWithOtpValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage("Invalid phone number format"),
  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .isLength({ min: 5, max: 6 })
    .withMessage("Code must be exactly 5-6 digits")
    .isNumeric()
    .withMessage("Code must be numeric"),
];
export const resendCodeValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage("Invalid phone number format"),
];

export const forgetPasswordValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage("Invalid phone number format"),
  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .isLength({ min: 5, max: 6 })
    .withMessage("Code must be exactly 5-6 digits")
    .isNumeric()
    .withMessage("Code must be numeric"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];
