import Joi from "joi";

export const createBlogValidator = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "عنوان باید یک متن باشد",
    "string.empty": "عنوان نمی‌تواند خالی باشد",
    "any.required": "فیلد عنوان الزامی است",
  }),
  description: Joi.string().required().messages({
    "string.base": "توضیحات باید یک متن باشد",
    "string.empty": "توضیحات نمی‌تواند خالی باشد",
    "any.required": "فیلد توضیحات الزامی است",
  }),
  img: Joi.string().required().messages({
    "string.base": "تصویر باید یک آدرس متنی باشد",
    "string.empty": "تصویر نمی‌تواند خالی باشد",
    "any.required": "فیلد تصویر الزامی است",
  }),
  date: Joi.string().required().messages({
    "string.base": "تاریخ باید یک متن باشد",
    "string.empty": "تاریخ نمی‌تواند خالی باشد",
    "any.required": "فیلد تاریخ الزامی است",
  }),
});

export const updateBlogValidator = Joi.object({
  title: Joi.string().messages({
    "string.base": "عنوان باید یک متن باشد",
    "string.empty": "عنوان نمی‌تواند خالی باشد",
  }),
  description: Joi.string().messages({
    "string.base": "توضیحات باید یک متن باشد",
    "string.empty": "توضیحات نمی‌تواند خالی باشد",
  }),
  img: Joi.string().messages({
    "string.base": "تصویر باید یک آدرس متنی باشد",
    "string.empty": "تصویر نمی‌تواند خالی باشد",
  }),
  date: Joi.string().messages({
    "string.base": "تاریخ باید یک متن باشد",
    "string.empty": "تاریخ نمی‌تواند خالی باشد",
  }),
});