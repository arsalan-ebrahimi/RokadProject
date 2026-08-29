import Joi from "joi";

export const updateSeoValidator = Joi.object({
  title: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_()،,.\u200C]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.base": "عنوان باید یک متن باشد",
    "string.empty": "عنوان نمی‌تواند خالی باشد",
    "any.required": "فیلد عنوان الزامی است",
  }),
  description: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_()،,.\u200C]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.base": "توضیحات باید یک متن باشد",
    "string.empty": "توضیحات نمی‌تواند خالی باشد",
    "any.required": "فیلد توضیحات الزامی است",
  }),
  keywords: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_()،,.\u200C]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).allow("").messages({
    "string.base": "کلمات کلیدی باید متنی باشد",
  }),
  robots: Joi.string().allow("").messages({
    "string.base": "روبات‌ها باید متنی باشد",
  }),
  canonicalUrl: Joi.string().allow("").messages({
    "string.base": "آدرس کنونیکال باید متنی باشد",
  }),
  ogTitle: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_()،,.\u200C]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).allow("").messages({
    "string.base": "عنوان OG باید متنی باشد",
  }),
  ogDescription: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_()،,.\u200C]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).allow("").messages({
    "string.base": "توضیحات OG باید متنی باشد",
  }),
  ogImage: Joi.string().allow("").messages({
    "string.base": "تصویر OG باید متنی باشد",
  }),
  ogType: Joi.string().allow("").messages({
    "string.base": "نوع OG باید متنی باشد",
  }),
  twitterCard: Joi.string().allow("").messages({
    "string.base": "کارت توییتر باید متنی باشد",
  }),
  twitterTitle: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_()،,.\u200C]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).allow("").messages({
    "string.base": "عنوان توییتر باید متنی باشد",
  }),
  twitterDescription: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_()،,.\u200C]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).allow("").messages({
    "string.base": "توضیحات توییتر باید متنی باشد",
  }),
  twitterImage: Joi.string().allow("").messages({
    "string.base": "تصویر توییتر باید متنی باشد",
  }),
});