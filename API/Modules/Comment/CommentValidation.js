import Joi from "joi";

export const createCommentValidator = Joi.object({
  author: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.base": "نام نویسنده باید یک متن باشد",
    "string.empty": "نام نویسنده نمی‌تواند خالی باشد",
    "any.required": "فیلد نام نویسنده الزامی است",
  }),
  content: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.base": "متن نظر باید یک متن باشد",
    "string.empty": "متن نظر نمی‌تواند خالی باشد",
    "any.required": "فیلد متن نظر الزامی است",
  }),
  role: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.base": "نقش باید یک متن باشد",
    "string.empty": "نقش نمی‌تواند خالی باشد",
    "any.required": "فیلد نقش الزامی است",
  }),
  img: Joi.string().pattern(/\.(jpe?g|png|svg|webp)$/i).messages({ "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد" }).required().messages({
    "string.base": "تصویر باید یک متن (نام فایل) باشد",
    "string.empty": "تصویر نمی‌تواند خالی باشد",
    "any.required": "فیلد تصویر الزامی است",
  }),
});

export const updateCommentValidator = Joi.object({
  author: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).messages({
    "string.base": "نام نویسنده باید یک متن باشد",
    "string.empty": "نام نویسنده نمی‌تواند خالی باشد",
  }),
  content: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).messages({
    "string.base": "متن نظر باید یک متن باشد",
    "string.empty": "متن نظر نمی‌تواند خالی باشد",
  }),
  role: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).messages({
    "string.base": "نقش باید یک متن باشد",
    "string.empty": "نقش نمی‌تواند خالی باشد",
  }),
  img: Joi.string().pattern(/\.(jpe?g|png|svg|webp)$/i).messages({ "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد" }).messages({
    "string.base": "تصویر باید یک متن (نام فایل) باشد",
    "string.empty": "تصویر نمی‌تواند خالی باشد",
  }),
});