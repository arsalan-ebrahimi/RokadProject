import Joi from "joi";

export const createEventValidator = Joi.object({
  title: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.empty": "عنوان رویداد نمی‌تواند خالی باشد",
    "any.required": "عنوان رویداد الزامی است",
  }),
  type: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.empty": "نوع رویداد نمی‌تواند خالی باشد",
    "any.required": "نوع رویداد الزامی است",
  }),
  date: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.empty": "تاریخ رویداد نمی‌تواند خالی باشد",
    "any.required": "تاریخ رویداد الزامی است",
  }),
  description: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).min(10).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد", "string.min": "توضیحات باید حداقل ۱۰ کاراکتر باشد" }).required().messages({
    "string.empty": "توضیحات رویداد نمی‌تواند خالی باشد",
    "any.required": "توضیحات رویداد الزامی است",
  }),
  img: Joi.string().pattern(/\.(jpe?g|png|svg|webp)$/i).messages({ "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد" }).required().messages({
    "string.empty": "تصویر رویداد نمی‌تواند خالی باشد",
    "any.required": "فیلد تصویر الزامی است",
  }),
  branch: Joi.array().items(Joi.string().valid("دخترانه", "پسرانه")).min(1).required().messages({
    "array.min": "حداقل یک شعبه باید انتخاب شود",
    "any.required": "مشخص کردن شعبه الزامی است",
    "any.only": "شعبه مدرسه باید 'دخترانه' یا 'پسرانه' باشد",
  }),
});

export const updateEventValidator = Joi.object({
  title: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }),
  type: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }),
  date: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }),
  description: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).min(10).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد", "string.min": "توضیحات باید حداقل ۱۰ کاراکتر باشد" }),
  img: Joi.string().pattern(/\.(jpe?g|png|svg|webp)$/i).messages({ "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد" }),
  branch: Joi.array().items(Joi.string().valid("دخترانه", "پسرانه")).min(1).messages({
    "array.min": "حداقل یک شعبه باید انتخاب شود",
    "any.only": "شعبه مدرسه باید 'دخترانه' یا 'پسرانه' باشد",
  }),
});