import Joi from "joi";

export const createEventValidator = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "عنوان باید یک متن باشد",
    "string.empty": "عنوان نمی‌تواند خالی باشد",
    "any.required": "فیلد عنوان الزامی است",
  }),
  type: Joi.string().required().messages({
    "string.base": "نوع رویداد باید یک متن باشد",
    "string.empty": "نوع رویداد نمی‌تواند خالی باشد",
    "any.required": "فیلد نوع رویداد الزامی است",
  }),
  date: Joi.string().required().messages({
    "string.base": "تاریخ باید یک متن باشد",
    "string.empty": "تاریخ نمی‌تواند خالی باشد",
    "any.required": "فیلد تاریخ الزامی است",
  }),
  description: Joi.string().required().messages({
    "string.base": "توضیحات باید یک متن باشد",
    "string.empty": "توضیحات نمی‌تواند خالی باشد",
    "any.required": "فیلد توضیحات الزامی است",
  }),
  branch: Joi.string().valid("دخترانه", "پسرانه").required().messages({
    "string.base": "شعبه باید یک متن باشد",
    "any.only": "شعبه مدرسه باید 'دخترانه' یا 'پسرانه' باشد",
    "any.required": "فیلد شعبه الزامی است",
  }),
});

export const updateEventValidator = Joi.object({
  title: Joi.string().messages({
    "string.base": "عنوان باید یک متن باشد",
    "string.empty": "عنوان نمی‌تواند خالی باشد",
  }),
  type: Joi.string().messages({
    "string.base": "نوع رویداد باید یک متن باشد",
    "string.empty": "نوع رویداد نمی‌تواند خالی باشد",
  }),
  date: Joi.string().messages({
    "string.base": "تاریخ باید یک متن باشد",
    "string.empty": "تاریخ نمی‌تواند خالی باشد",
  }),
  description: Joi.string().messages({
    "string.base": "توضیحات باید یک متن باشد",
    "string.empty": "توضیحات نمی‌تواند خالی باشد",
  }),
  branch: Joi.string().valid("دخترانه", "پسرانه").messages({
    "string.base": "شعبه باید یک متن باشد",
    "any.only": "شعبه مدرسه باید 'دخترانه' یا 'پسرانه' باشد",
  }),
});