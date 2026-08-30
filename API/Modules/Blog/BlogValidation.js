import Joi from "joi";

export const createBlogValidator = Joi.object({
  title: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.base": "عنوان باید یک متن باشد",
    "string.empty": "عنوان نمی‌تواند خالی باشد",
    "any.required": "فیلد عنوان الزامی است",
  }),
  description: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).min(10).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد", "string.min": "توضیحات باید حداقل ۱۰ کاراکتر باشد" }).required().messages({
    "string.base": "توضیحات باید یک متن باشد",
    "string.empty": "توضیحات نمی‌تواند خالی باشد",
    "any.required": "فیلد توضیحات الزامی است",
  }),
  img: Joi.string().pattern(/\.(jpe?g|png|svg|webp)$/i).messages({ "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد" }).required().messages({
    "string.base": "تصویر باید یک آدرس متنی باشد",
    "string.empty": "تصویر نمی‌تواند خالی باشد",
    "any.required": "فیلد تصویر الزامی است",
  }),
  date: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.base": "تاریخ باید یک متن باشد",
    "string.empty": "تاریخ نمی‌تواند خالی باشد",
    "any.required": "فیلد تاریخ الزامی است",
  }),
});

export const updateBlogValidator = Joi.object({
  title: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).messages({
    "string.base": "عنوان باید یک متن باشد",
    "string.empty": "عنوان نمی‌تواند خالی باشد",
  }),
  description: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).min(10).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد", "string.min": "توضیحات باید حداقل ۱۰ کاراکتر باشد" }).messages({
    "string.base": "توضیحات باید یک متن باشد",
    "string.empty": "توضیحات نمی‌تواند خالی باشد",
  }),
  img: Joi.string().pattern(/\.(jpe?g|png|svg|webp)$/i).messages({ "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد" }).messages({
    "string.base": "تصویر باید یک آدرس متنی باشد",
    "string.empty": "تصویر نمی‌تواند خالی باشد",
  }),
  date: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).messages({
    "string.base": "تاریخ باید یک متن باشد",
    "string.empty": "تاریخ نمی‌تواند خالی باشد",
  }),
});