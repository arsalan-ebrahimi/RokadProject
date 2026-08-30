import Joi from "joi";

export const createStudentValidator = Joi.object({
  fullName: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.base": "نام کامل باید یک متن باشد",
    "string.empty": "نام کامل نمی‌تواند خالی باشد",
    "any.required": "فیلد نام کامل الزامی است",
  }),
  job: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.base": "شغل باید یک متن باشد",
    "string.empty": "شغل نمی‌تواند خالی باشد",
    "any.required": "فیلد شغل الزامی است",
  }),
  generation: Joi.number().required().messages({
    "number.base": "نسل باید یک عدد باشد",
    "any.required": "فیلد نسل الزامی است",
  }),
  schoolType: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.base": "نوع مدرسه باید یک متن باشد",
    "string.empty": "نوع مدرسه نمی‌تواند خالی باشد",
    "any.required": "فیلد نوع مدرسه الزامی است",
  }),
  major: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
    "string.base": "رشته تحصیلی باید یک متن باشد",
    "string.empty": "رشته تحصیلی نمی‌تواند خالی باشد",
    "any.required": "فیلد رشته تحصیلی الزامی است",
  }),
  img: Joi.string().pattern(/\.(jpe?g|png|svg|webp)$/i).messages({ "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد" }).required().messages({
    "string.base": "تصویر باید یک متن (نام فایل) باشد",
    "string.empty": "تصویر نمی‌تواند خالی باشد",
    "any.required": "فیلد تصویر الزامی است",
  }),
  socialLinks: Joi.array().items(
    Joi.object({
      _id: Joi.any(), 
      type: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
        "string.base": "نوع شبکه اجتماعی باید متن باشد",
        "string.empty": "نوع شبکه اجتماعی نمی‌تواند خالی باشد",
        "any.required": "فیلد نوع الزامی است",
      }),
      link: Joi.string().required().messages({
        "string.base": "لینک باید یک متن باشد",
        "string.empty": "لینک نمی‌تواند خالی باشد",
        "any.required": "فیلد لینک الزامی است",
      })
    })
  ).optional().messages({
    "array.base": "لینک‌ها باید به صورت یک آرایه ارسال شوند",
  })
});

export const updateStudentValidator = Joi.object({
  fullName: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).messages({
    "string.base": "نام کامل باید یک متن باشد",
    "string.empty": "نام کامل نمی‌تواند خالی باشد",
  }),
  job: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).messages({
    "string.base": "شغل باید یک متن باشد",
    "string.empty": "شغل نمی‌تواند خالی باشد",
  }),
  generation: Joi.number().messages({
    "number.base": "نسل باید یک عدد باشد",
  }),
  schoolType: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).messages({
    "string.base": "نوع مدرسه باید یک متن باشد",
    "string.empty": "نوع مدرسه نمی‌تواند خالی باشد",
  }),
  major: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).messages({
    "string.base": "رشته تحصیلی باید یک متن باشد",
    "string.empty": "رشته تحصیلی نمی‌تواند خالی باشد",
  }),
  img: Joi.string().pattern(/\.(jpe?g|png|svg|webp)$/i).messages({ "string.pattern.base": "پسوند فایل باید یکی از موارد JPG, JPEG, PNG, SVG, WEBP باشد" }).messages({
    "string.base": "تصویر باید یک متن (نام فایل) باشد",
    "string.empty": "تصویر نمی‌تواند خالی باشد",
  }),
  socialLinks: Joi.array().items(
    Joi.object({
      _id: Joi.any(), 
      type: Joi.string().pattern(/^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/).messages({ "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" }).required().messages({
        "string.base": "نوع شبکه اجتماعی باید متن باشد",
        "string.empty": "نوع شبکه اجتماعی نمی‌تواند خالی باشد",
        "any.required": "فیلد نوع الزامی است",
      }),
      link: Joi.string().required().messages({
        "string.base": "لینک باید یک متن باشد",
        "string.empty": "لینک نمی‌تواند خالی باشد",
        "any.required": "فیلد لینک الزامی است",
      })
    })
  ).optional().messages({
    "array.base": "لینک‌ها باید به صورت یک آرایه ارسال شوند",
  })
});