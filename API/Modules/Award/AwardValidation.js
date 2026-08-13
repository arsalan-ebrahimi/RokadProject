import Joi from "joi";

export const createAwardValidator = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "عنوان باید یک متن باشد",
    "string.empty": "عنوان نمی‌تواند خالی باشد",
    "any.required": "فیلد عنوان الزامی است",
  }),
  rank: Joi.number().valid(1, 2, 3).required().messages({
    "number.base": "مقام باید عدد باشد",
    "any.only": "مقام باید یکی از مقادیر 1، 2 یا 3 باشد",
    "any.required": "فیلد مقام الزامی است",
  }),
  description: Joi.string().required().messages({
    "string.base": "توضیحات باید یک متن باشد",
    "string.empty": "توضیحات نمی‌تواند خالی باشد",
    "any.required": "فیلد توضیحات الزامی است",
  }),
  winners: Joi.array().items(Joi.string().hex().length(24)).min(1).required().messages({
    "array.base": "برندگان باید به صورت آرایه ارسال شوند",
    "array.min": "حداقل یک برنده باید انتخاب شود",
    "any.required": "انتخاب حداقل یک برنده الزامی است",
    "string.hex": "آیدی دانش‌آموز نامعتبر است",
    "string.length": "آیدی دانش‌آموز نامعتبر است"
  })
});

export const updateAwardValidator = Joi.object({
  title: Joi.string().messages({
    "string.base": "عنوان باید یک متن باشد",
    "string.empty": "عنوان نمی‌تواند خالی باشد",
  }),
  rank: Joi.number().valid(1, 2, 3).messages({
    "number.base": "مقام باید عدد باشد",
    "any.only": "مقام باید یکی از مقادیر 1، 2 یا 3 باشد",
  }),
  description: Joi.string().messages({
    "string.base": "توضیحات باید یک متن باشد",
    "string.empty": "توضیحات نمی‌تواند خالی باشد",
  }),
  winners: Joi.array().items(Joi.string().hex().length(24)).min(1).messages({
    "array.base": "برندگان باید به صورت آرایه ارسال شوند",
    "array.min": "حداقل یک برنده باید انتخاب شود",
    "string.hex": "آیدی دانش‌آموز نامعتبر است",
    "string.length": "آیدی دانش‌آموز نامعتبر است"
  })
});