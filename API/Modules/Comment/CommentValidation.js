import Joi from "joi";

export const createCommentValidator = Joi.object({
  author: Joi.string().required().messages({
    "string.base": "نام نویسنده باید یک متن باشد",
    "string.empty": "نام نویسنده نمی‌تواند خالی باشد",
    "any.required": "فیلد نام نویسنده الزامی است",
  }),
  content: Joi.string().required().messages({
    "string.base": "متن نظر باید یک متن باشد",
    "string.empty": "متن نظر نمی‌تواند خالی باشد",
    "any.required": "فیلد متن نظر الزامی است",
  }),
  role: Joi.string().required().messages({
    "string.base": "نقش باید یک متن باشد",
    "string.empty": "نقش نمی‌تواند خالی باشد",
    "any.required": "فیلد نقش الزامی است",
  }),
  img: Joi.string().required().messages({
    "string.base": "تصویر باید یک متن (نام فایل) باشد",
    "string.empty": "تصویر نمی‌تواند خالی باشد",
    "any.required": "فیلد تصویر الزامی است",
  }),
});

export const updateCommentValidator = Joi.object({
  author: Joi.string().messages({
    "string.base": "نام نویسنده باید یک متن باشد",
    "string.empty": "نام نویسنده نمی‌تواند خالی باشد",
  }),
  content: Joi.string().messages({
    "string.base": "متن نظر باید یک متن باشد",
    "string.empty": "متن نظر نمی‌تواند خالی باشد",
  }),
  role: Joi.string().messages({
    "string.base": "نقش باید یک متن باشد",
    "string.empty": "نقش نمی‌تواند خالی باشد",
  }),
  img: Joi.string().messages({
    "string.base": "تصویر باید یک متن (نام فایل) باشد",
    "string.empty": "تصویر نمی‌تواند خالی باشد",
  }),
});