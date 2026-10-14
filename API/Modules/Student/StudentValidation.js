import Joi from "joi";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/;

const keyActivityValidator = Joi.object({
  _id: Joi.any().optional(),
  title: Joi.string()
    .trim()
    .pattern(safeTextRegex)
    .max(150)
    .required()
    .messages({
      "string.base": "عنوان فعالیت باید متن باشد",
      "string.empty": "عنوان فعالیت نمی‌تواند خالی باشد",
      "string.pattern.base": "عنوان فعالیت شامل کاراکترهای غیرمجاز است",
      "any.required": "عنوان فعالیت الزامی است",
    }),
  description: Joi.string()
    .trim()
    .allow("")
    .max(2000)
    .messages({
      "string.max": "توضیحات فعالیت حداکثر ۲۰۰۰ کاراکتر است",
    }),
});

const socialLinkValidator = Joi.object({
  _id: Joi.any().optional(),
  type: Joi.string()
    .pattern(safeTextRegex)
    .messages({ "string.pattern.base": "نوع شبکه اجتماعی نباید شامل کاراکترهای خاص باشد" })
    .required()
    .messages({
      "string.base": "نوع شبکه اجتماعی باید متن باشد",
      "string.empty": "نوع شبکه اجتماعی نمی‌تواند خالی باشد",
      "any.required": "فیلد نوع الزامی است",
    }),
  link: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": "لینک باید یک متن باشد",
      "string.empty": "لینک نمی‌تواند خالی باشد",
      "any.required": "فیلد لینک الزامی است",
    }),
});

export const createStudentValidator = Joi.object({
  fullName: Joi.string()
    .pattern(safeTextRegex)
    .max(100)
    .required()
    .messages({
      "string.base": "نام کامل باید یک متن باشد",
      "string.empty": "نام کامل نمی‌تواند خالی باشد",
      "string.pattern.base": "نام کامل شامل کاراکترهای غیرمجاز است",
      "any.required": "فیلد نام کامل الزامی است",
    }),
  job: Joi.string()
    .pattern(safeTextRegex)
    .max(150)
    .required()
    .messages({
      "string.base": "وضعیت شغلی باید یک متن باشد",
      "string.empty": "وضعیت شغلی نمی‌تواند خالی باشد",
      "string.pattern.base": "وضعیت شغلی شامل کاراکترهای غیرمجاز است",
      "any.required": "فیلد وضعیت شغلی الزامی است",
    }),
  generation: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "نسل باید یک عدد باشد",
      "any.required": "فیلد نسل الزامی است",
    }),
  schoolType: Joi.string()
    .pattern(safeTextRegex)
    .max(150)
    .required()
    .messages({
      "string.base": "نوع مدرسه باید یک متن باشد",
      "string.empty": "نوع مدرسه نمی‌تواند خالی باشد",
      "string.pattern.base": "نوع مدرسه شامل کاراکترهای غیرمجاز است",
      "any.required": "فیلد نوع مدرسه الزامی است",
    }),
  major: Joi.string()
    .pattern(safeTextRegex)
    .max(200)
    .required()
    .messages({
      "string.base": "رشته تحصیلی باید یک متن باشد",
      "string.empty": "رشته تحصیلی نمی‌تواند خالی باشد",
      "string.pattern.base": "رشته تحصیلی شامل کاراکترهای غیرمجاز است",
      "any.required": "فیلد رشته تحصیلی الزامی است",
    }),
  img: Joi.string()
    .pattern(/\.(jpe?g|png|svg|webp)$/i)
    .required()
    .messages({
      "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد",
      "any.required": "فیلد تصویر الزامی است",
    }),
  socialLinks: Joi.array().items(socialLinkValidator).optional(),

  // Extended dossier & Identity card
  about: Joi.string().trim().allow("").max(10000).optional(),
  rokadStory: Joi.string().trim().allow("").max(10000).optional(),
  achievements: Joi.string().trim().allow("").max(5000).optional(),
  keyActivities: Joi.array().items(keyActivityValidator).max(50).optional(),

  currentCity: Joi.string().trim().allow("").max(100).optional(),
  graduationYear: Joi.string().trim().allow("").max(50).optional(),
  portfolioCount: Joi.number().integer().min(0).default(0).optional(),
});

export const updateStudentValidator = Joi.object({
  fullName: Joi.string().pattern(safeTextRegex).max(100),
  job: Joi.string().pattern(safeTextRegex).max(150),
  generation: Joi.number().integer().min(1),
  schoolType: Joi.string().pattern(safeTextRegex).max(150),
  major: Joi.string().pattern(safeTextRegex).max(200),
  img: Joi.string().pattern(/\.(jpe?g|png|svg|webp)$/i),
  socialLinks: Joi.array().items(socialLinkValidator),

  about: Joi.string().trim().allow("").max(10000),
  rokadStory: Joi.string().trim().allow("").max(10000),
  achievements: Joi.string().trim().allow("").max(5000),
  keyActivities: Joi.array().items(keyActivityValidator).max(50),

  currentCity: Joi.string().trim().allow("").max(100),
  graduationYear: Joi.string().trim().allow("").max(50),
  portfolioCount: Joi.number().integer().min(0),
});