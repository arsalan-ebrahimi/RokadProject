import Joi from "joi";

export const createEventValidator = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "عنوان رویداد نمی‌تواند خالی باشد",
    "any.required": "عنوان رویداد الزامی است",
  }),
  type: Joi.string().required().messages({
    "string.empty": "نوع رویداد نمی‌تواند خالی باشد",
    "any.required": "نوع رویداد الزامی است",
  }),
  date: Joi.string().required().messages({
    "string.empty": "تاریخ رویداد نمی‌تواند خالی باشد",
    "any.required": "تاریخ رویداد الزامی است",
  }),
  description: Joi.string().required().messages({
    "string.empty": "توضیحات رویداد نمی‌تواند خالی باشد",
    "any.required": "توضیحات رویداد الزامی است",
  }),
  img: Joi.string().required().messages({
    "string.empty": "تصویر رویداد نمی‌تواند خالی باشد",
    "any.required": "فیلد تصویر الزامی است",
  }),
  branch: Joi.string().valid("دخترانه", "پسرانه").required().messages({
    "any.only": "شعبه مدرسه باید 'دخترانه' یا 'پسرانه' باشد",
    "any.required": "مشخص کردن شعبه الزامی است",
  }),
});

export const updateEventValidator = Joi.object({
  title: Joi.string(),
  type: Joi.string(),
  date: Joi.string(),
  description: Joi.string(),
  img: Joi.string(),
  branch: Joi.string().valid("دخترانه", "پسرانه").messages({
    "any.only": "شعبه مدرسه باید 'دخترانه' یا 'پسرانه' باشد",
  }),
});