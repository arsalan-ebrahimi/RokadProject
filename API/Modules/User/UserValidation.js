import Joi from "joi";

export const updateUserValidator = Joi.object({
  fullName: Joi.string().allow("").messages({
    "string.base": "نام و نام خانوادگی باید یک متن باشد",
  }),
  password: Joi.string().min(6).messages({
    "string.min": "رمز عبور باید حداقل ۶ کاراکتر باشد",
  }),
  birthDate: Joi.string().allow("").messages({
    "string.base": "تاریخ تولد باید یک متن باشد",
  }),
  role: Joi.string().valid("user", "admin", "superAdmin").messages({
    "any.only": "نقش کاربر نامعتبر است",
  })
});