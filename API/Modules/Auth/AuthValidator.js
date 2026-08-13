import Joi from "joi";

const phoneRegex = /^(\+98|0)?9\d{9}$/;

export const authValidator = Joi.object({
  phoneNumber: Joi.string().pattern(phoneRegex).required().messages({
    "string.empty": "شماره موبایل نمی‌تواند خالی باشد",
    "string.pattern.base": "فرمت شماره موبایل نامعتبر است",
    "any.required": "وارد کردن شماره موبایل الزامی است",
  }),
});

export const loginWithPasswordValidator = Joi.object({
  phoneNumber: Joi.string().pattern(phoneRegex).required().messages({
    "string.empty": "شماره موبایل نمی‌تواند خالی باشد",
    "string.pattern.base": "فرمت شماره موبایل نامعتبر است",
    "any.required": "وارد کردن شماره موبایل الزامی است",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "رمز عبور نمی‌تواند خالی باشد",
    "string.min": "رمز عبور باید حداقل ۶ کاراکتر باشد",
    "any.required": "وارد کردن رمز عبور الزامی است",
  }),
});

export const loginWithOtpValidator = Joi.object({
  phoneNumber: Joi.string().pattern(phoneRegex).required().messages({
    "string.empty": "شماره موبایل نمی‌تواند خالی باشد",
    "string.pattern.base": "فرمت شماره موبایل نامعتبر است",
    "any.required": "وارد کردن شماره موبایل الزامی است",
  }),
  code: Joi.string().min(5).max(6).pattern(/^[0-9]+$/).required().messages({
    "string.empty": "کد تایید نمی‌تواند خالی باشد",
    "string.min": "کد تایید نامعتبر است",
    "string.max": "کد تایید نامعتبر است",
    "string.pattern.base": "کد تایید باید فقط شامل اعداد باشد",
    "any.required": "وارد کردن کد تایید الزامی است",
  }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "رمز عبور باید حداقل ۶ کاراکتر باشد",
  }),
});

export const resendCodeValidator = Joi.object({
  phoneNumber: Joi.string().pattern(phoneRegex).required().messages({
    "string.empty": "شماره موبایل نمی‌تواند خالی باشد",
    "string.pattern.base": "فرمت شماره موبایل نامعتبر است",
    "any.required": "وارد کردن شماره موبایل الزامی است",
  }),
});

export const forgetPasswordValidator = Joi.object({
  phoneNumber: Joi.string().pattern(phoneRegex).required().messages({
    "string.empty": "شماره موبایل نمی‌تواند خالی باشد",
    "string.pattern.base": "فرمت شماره موبایل نامعتبر است",
    "any.required": "وارد کردن شماره موبایل الزامی است",
  }),
  code: Joi.string().min(5).max(6).pattern(/^[0-9]+$/).required().messages({
    "string.empty": "کد تایید نمی‌تواند خالی باشد",
    "string.min": "کد تایید نامعتبر است",
    "string.max": "کد تایید نامعتبر است",
    "string.pattern.base": "کد تایید باید فقط شامل اعداد باشد",
    "any.required": "وارد کردن کد تایید الزامی است",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.empty": "رمز عبور جدید نمی‌تواند خالی باشد",
    "string.min": "رمز عبور جدید باید حداقل ۸ کاراکتر باشد",
    "any.required": "وارد کردن رمز عبور جدید الزامی است",
  }),
});