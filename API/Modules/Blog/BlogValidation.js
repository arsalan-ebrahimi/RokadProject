import Joi from "joi";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/;

export const createBlogValidator = Joi.object({
  title: Joi.string()
    .pattern(safeTextRegex)
    .messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" })
    .max(200)
    .required()
    .messages({
      "string.base": "عنوان باید یک متن باشد",
      "string.empty": "عنوان نمی‌تواند خالی باشد",
      "string.max": "عنوان نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد",
      "any.required": "فیلد عنوان الزامی است",
    }),
  description: Joi.string()
    .pattern(safeTextRegex)
    .min(10)
    .max(2000)
    .messages({
      "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد",
      "string.min": "توضیحات باید حداقل ۱۰ کاراکتر باشد",
      "string.max": "توضیحات نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد",
    })
    .required()
    .messages({
      "string.base": "توضیحات باید یک متن باشد",
      "string.empty": "توضیحات نمی‌تواند خالی باشد",
      "any.required": "فیلد توضیحات الزامی است",
    }),
  img: Joi.string()
    .pattern(/\.(jpe?g|png|svg|webp)$/i)
    .messages({ "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد" })
    .required()
    .messages({
      "string.base": "تصویر باید یک آدرس متنی باشد",
      "string.empty": "تصویر نمی‌تواند خالی باشد",
      "any.required": "فیلد تصویر الزامی است",
    }),
  date: Joi.string()
    .pattern(safeTextRegex)
    .messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" })
    .required()
    .messages({
      "string.base": "تاریخ باید یک متن باشد",
      "string.empty": "تاریخ نمی‌تواند خالی باشد",
      "any.required": "فیلد تاریخ الزامی است",
    }),
  tags: Joi.array()
    .items(
      Joi.string()
        .trim()
        .pattern(safeTextRegex)
        .max(60)
        .messages({
          "string.pattern.base": "تگ نباید شامل کاراکترهای غیرمجاز باشد",
          "string.max": "طول هر تگ حداکثر ۶۰ کاراکتر است",
        })
    )
    .max(30)
    .optional()
    .messages({
      "array.base": "تگ‌ها باید به صورت آرایه ارسال شوند",
      "array.max": "تعداد تگ‌ها حداکثر ۳۰ عدد می‌باشد",
    }),
  tableOfContents: Joi.array()
    .items(
      Joi.object({
        _id: Joi.any().optional(),
        title: Joi.string()
          .trim()
          .pattern(safeTextRegex)
          .max(200)
          .required()
          .messages({
            "string.base": "عنوان سرفصل باید متن باشد",
            "string.empty": "عنوان سرفصل نمی‌تواند خالی باشد",
            "string.pattern.base": "عنوان سرفصل نباید شامل کاراکترهای غیرمجاز باشد",
            "any.required": "عنوان سرفصل در فهرست مطالب الزامی است",
          }),
      })
    )
    .max(50)
    .optional()
    .messages({
      "array.base": "فهرست مطالب باید به صورت آرایه ارسال شود",
      "array.max": "فهرست مطالب حداکثر می‌تواند ۵۰ آیتم داشته باشد",
    }),
  htmlContent: Joi.string()
    .allow("")
    .max(200000)
    .optional()
    .messages({
      "string.base": "محتوای HTML مقاله باید متن باشد",
      "string.max": "محتوای مقاله بیش از حد طولانی است (حداکثر ۲۰۰,۰۰۰ کاراکتر)",
    }),
});

export const updateBlogValidator = Joi.object({
  title: Joi.string()
    .pattern(safeTextRegex)
    .messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" })
    .max(200)
    .messages({
      "string.base": "عنوان باید یک متن باشد",
      "string.empty": "عنوان نمی‌تواند خالی باشد",
      "string.max": "عنوان نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد",
    }),
  description: Joi.string()
    .pattern(safeTextRegex)
    .min(10)
    .max(2000)
    .messages({
      "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد",
      "string.min": "توضیحات باید حداقل ۱۰ کاراکتر باشد",
      "string.max": "توضیحات نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد",
    })
    .messages({
      "string.base": "توضیحات باید یک متن باشد",
      "string.empty": "توضیحات نمی‌تواند خالی باشد",
    }),
  img: Joi.string()
    .pattern(/\.(jpe?g|png|svg|webp)$/i)
    .messages({ "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد" })
    .messages({
      "string.base": "تصویر باید یک آدرس متنی باشد",
      "string.empty": "تصویر نمی‌تواند خالی باشد",
    }),
  date: Joi.string()
    .pattern(safeTextRegex)
    .messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" })
    .messages({
      "string.base": "تاریخ باید یک متن باشد",
      "string.empty": "تاریخ نمی‌تواند خالی باشد",
    }),
  tags: Joi.array()
    .items(
      Joi.string()
        .trim()
        .pattern(safeTextRegex)
        .max(60)
        .messages({
          "string.pattern.base": "تگ نباید شامل کاراکترهای غیرمجاز باشد",
          "string.max": "طول هر تگ حداکثر ۶۰ کاراکتر است",
        })
    )
    .max(30)
    .optional()
    .messages({
      "array.base": "تگ‌ها باید به صورت آرایه ارسال شوند",
      "array.max": "تعداد تگ‌ها حداکثر ۳۰ عدد می‌باشد",
    }),
  tableOfContents: Joi.array()
    .items(
      Joi.object({
        _id: Joi.any().optional(),
        title: Joi.string()
          .trim()
          .pattern(safeTextRegex)
          .max(200)
          .required()
          .messages({
            "string.base": "عنوان سرفصل باید متن باشد",
            "string.empty": "عنوان سرفصل نمی‌تواند خالی باشد",
            "string.pattern.base": "عنوان سرفصل نباید شامل کاراکترهای غیرمجاز باشد",
            "any.required": "عنوان سرفصل در فهرست مطالب الزامی است",
          }),
      })
    )
    .max(50)
    .optional()
    .messages({
      "array.base": "فهرست مطالب باید به صورت آرایه ارسال شود",
      "array.max": "فهرست مطالب حداکثر می‌تواند ۵۰ آیتم داشته باشد",
    }),
  htmlContent: Joi.string()
    .allow("")
    .max(200000)
    .optional()
    .messages({
      "string.base": "محتوای HTML مقاله باید متن باشد",
      "string.max": "محتوای مقاله بیش از حد طولانی است (حداکثر ۲۰۰,۰۰۰ کاراکتر)",
    }),
});