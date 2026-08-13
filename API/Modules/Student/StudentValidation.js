import Joi from "joi";

export const createStudentValidator = Joi.object({
  fullName: Joi.string().required().messages({
    "string.base": "نام کامل باید یک متن باشد",
    "string.empty": "نام کامل نمی‌تواند خالی باشد",
    "any.required": "فیلد نام کامل الزامی است",
  }),
  job: Joi.string().required().messages({
    "string.base": "شغل باید یک متن باشد",
    "string.empty": "شغل نمی‌تواند خالی باشد",
    "any.required": "فیلد شغل الزامی است",
  }),
  generation: Joi.number().required().messages({
    "number.base": "نسل باید یک عدد باشد",
    "any.required": "فیلد نسل الزامی است",
  }),
  socialLinks: Joi.array().items(
    Joi.object({
      type: Joi.string().required().messages({
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
  fullName: Joi.string().messages({
    "string.base": "نام کامل باید یک متن باشد",
    "string.empty": "نام کامل نمی‌تواند خالی باشد",
  }),
  job: Joi.string().messages({
    "string.base": "شغل باید یک متن باشد",
    "string.empty": "شغل نمی‌تواند خالی باشد",
  }),
  generation: Joi.number().messages({
    "number.base": "نسل باید یک عدد باشد",
  }),
  socialLinks: Joi.array().items(
    Joi.object({
      type: Joi.string().required().messages({
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