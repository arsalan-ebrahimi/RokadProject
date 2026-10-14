import Joi from "joi";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/;

const organizerValidator = Joi.object({
  _id: Joi.any().optional(),
  name: Joi.string()
    .trim()
    .pattern(safeTextRegex)
    .max(100)
    .required()
    .messages({
      "string.base": "نام عضو کادر باید متن باشد",
      "string.empty": "نام عضو کادر نمی‌تواند خالی باشد",
      "string.pattern.base": "نام عضو کادر شامل کاراکترهای غیرمجاز است",
      "any.required": "وارد کردن نام عضو کادر الزامی است",
    }),
  role: Joi.string()
    .trim()
    .pattern(safeTextRegex)
    .max(100)
    .required()
    .messages({
      "string.base": "نقش عضو کادر باید متن باشد",
      "string.empty": "نقش عضو کادر نمی‌تواند خالی باشد",
      "string.pattern.base": "نقش عضو کادر شامل کاراکترهای غیرمجاز است",
      "any.required": "وارد کردن نقش عضو کادر الزامی است",
    }),
  category: Joi.string()
    .valid("منتور", "عوامل اجرایی", "داور")
    .required()
    .messages({
      "any.only": "دسته‌بندی باید یکی از موارد 'منتور'، 'عوامل اجرایی' یا 'داور' باشد",
      "any.required": "انتخاب دسته‌بندی نقش الزامی است",
    }),
});

const teamPodiumValidator = Joi.object({
  name: Joi.string()
    .trim()
    .allow("")
    .max(150)
    .messages({
      "string.max": "نام تیم حداکثر ۱۵۰ کاراکتر است",
    }),
  isHonored: Joi.boolean().default(false),
});

const deadlineValidator = Joi.object({
  _id: Joi.any().optional(),
  title: Joi.string()
    .trim()
    .pattern(safeTextRegex)
    .max(150)
    .required()
    .messages({
      "string.base": "عنوان ددلاین باید متن باشد",
      "string.empty": "عنوان ددلاین نمی‌تواند خالی باشد",
      "string.pattern.base": "عنوان ددلاین شامل کاراکترهای غیرمجاز است",
      "any.required": "عنوان ددلاین الزامی است",
    }),
  date: Joi.string()
    .trim()
    .allow("")
    .max(50)
    .messages({
      "string.max": "تاریخ ددلاین حداکثر ۵۰ کاراکتر است",
    }),
  description: Joi.string()
    .trim()
    .allow("")
    .max(1000)
    .messages({
      "string.max": "توضیحات ددلاین حداکثر ۱۰۰۰ کاراکتر است",
    }),
});

export const createEventValidator = Joi.object({
  title: Joi.string()
    .pattern(safeTextRegex)
    .max(200)
    .required()
    .messages({
      "string.base": "عنوان باید یک متن باشد",
      "string.empty": "عنوان نمی‌تواند خالی باشد",
      "string.pattern.base": "عنوان شامل کاراکترهای غیرمجاز است",
      "any.required": "فیلد عنوان الزامی است",
    }),
  type: Joi.string()
    .pattern(safeTextRegex)
    .max(100)
    .required()
    .messages({
      "string.base": "نوع رویداد باید یک متن باشد",
      "string.empty": "نوع رویداد نمی‌تواند خالی باشد",
      "string.pattern.base": "نوع رویداد شامل کاراکترهای غیرمجاز است",
      "any.required": "فیلد نوع رویداد الزامی است",
    }),
  date: Joi.string()
    .pattern(safeTextRegex)
    .max(100)
    .required()
    .messages({
      "string.base": "تاریخ باید یک متن باشد",
      "string.empty": "تاریخ نمی‌تواند خالی باشد",
      "any.required": "فیلد تاریخ الزامی است",
    }),
  description: Joi.string()
    .pattern(safeTextRegex)
    .min(10)
    .max(5000)
    .required()
    .messages({
      "string.base": "توضیحات باید یک متن باشد",
      "string.empty": "توضیحات نمی‌تواند خالی باشد",
      "string.min": "توضیحات باید حداقل ۱۰ کاراکتر باشد",
      "any.required": "فیلد توضیحات الزامی است",
    }),
  img: Joi.string()
    .pattern(/\.(jpe?g|png|svg|webp)$/i)
    .required()
    .messages({
      "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد",
      "any.required": "فیلد تصویر الزامی است",
    }),
  branch: Joi.array()
    .items(Joi.string().valid("دخترانه", "پسرانه"))
    .min(1)
    .required()
    .messages({
      "array.min": "حداقل یک شعبه باید انتخاب شود",
      "any.required": "مشخص کردن شعبه الزامی است",
    }),

  // Extended fields
  eventDuration: Joi.string().trim().allow("").max(100),
  closingLocation: Joi.string().trim().allow("").max(200),
  holdingDate: Joi.string().trim().allow("").max(100),

  // Minimum 3 organizers required per prompt specification
  organizers: Joi.array()
    .items(organizerValidator)
    .min(3)
    .required()
    .messages({
      "array.base": "کادر رویداد باید به صورت آرایه ارسال شود",
      "array.min": "ثبت حداقل ۳ نفر از اعضای کادر رویداد (منتور، داور، عوامل اجرایی) الزامی است",
      "any.required": "ثبت کادر رویداد الزامی است",
    }),

  teams: Joi.object({
    firstTeam: teamPodiumValidator.optional(),
    secondTeam: teamPodiumValidator.optional(),
    thirdTeam: teamPodiumValidator.optional(),
    honoredTeams: Joi.array()
      .items(
        Joi.object({
          _id: Joi.any().optional(),
          name: Joi.string().trim().required().messages({
            "string.empty": "نام تیم شایسته تقدیر نمی‌تواند خالی باشد",
            "any.required": "نام تیم شایسته تقدیر الزامی است",
          }),
        })
      )
      .optional(),
  }).optional(),

  howItWent: Joi.string().trim().allow("").max(10000).optional(),

  memorableQuote: Joi.object({
    quote: Joi.string().trim().allow("").max(1000).optional(),
    speaker: Joi.string().trim().allow("").max(100).optional(),
  }).optional(),

  deadlinesDescription: Joi.string().trim().allow("").max(1000).optional(),

  deadlines: Joi.array().items(deadlineValidator).max(50).optional(),

  tags: Joi.array()
    .items(Joi.string().trim().max(60))
    .max(30)
    .optional(),
});

export const updateEventValidator = Joi.object({
  title: Joi.string().pattern(safeTextRegex).max(200),
  type: Joi.string().pattern(safeTextRegex).max(100),
  date: Joi.string().pattern(safeTextRegex).max(100),
  description: Joi.string().pattern(safeTextRegex).min(10).max(5000),
  img: Joi.string().pattern(/\.(jpe?g|png|svg|webp)$/i),
  branch: Joi.array().items(Joi.string().valid("دخترانه", "پسرانه")).min(1),

  eventDuration: Joi.string().trim().allow("").max(100),
  closingLocation: Joi.string().trim().allow("").max(200),
  holdingDate: Joi.string().trim().allow("").max(100),

  organizers: Joi.array()
    .items(organizerValidator)
    .min(3)
    .messages({
      "array.min": "در صورت ویرایش، حداقل ۳ عضو کادر رویداد باید تعیین شوند",
    }),

  teams: Joi.object({
    firstTeam: teamPodiumValidator.optional(),
    secondTeam: teamPodiumValidator.optional(),
    thirdTeam: teamPodiumValidator.optional(),
    honoredTeams: Joi.array()
      .items(
        Joi.object({
          _id: Joi.any().optional(),
          name: Joi.string().trim().required(),
        })
      )
      .optional(),
  }).optional(),

  howItWent: Joi.string().trim().allow("").max(10000),
  memorableQuote: Joi.object({
    quote: Joi.string().trim().allow("").max(1000),
    speaker: Joi.string().trim().allow("").max(100),
  }),
  deadlinesDescription: Joi.string().trim().allow("").max(1000),
  deadlines: Joi.array().items(deadlineValidator).max(50),
  tags: Joi.array().items(Joi.string().trim().max(60)).max(30),
});