import Joi from "joi";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_()،,.\u200C]+$/;
const safeTextMessages = { "string.pattern.base": "این فیلد نباید شامل کاراکترهای خاص و غیرمجاز باشد" };

export const createEnrollmentValidator = Joi.object({
  firstName: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).required(),
  lastName: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).required(),
  fatherName: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).required(),
  motherName: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).required(),
  nationalCode: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).length(10).required(),
  birthDate: Joi.object({
    day: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).required(),
    month: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).required(),
    year: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).required(),
  }).required(),
  mobileNumber: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).required(),
  parentsMobileNumber: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).required(),
  grade: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).required(),
  schoolType: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).required(),
  major: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).required(),
});

export const updateEnrollmentValidator = Joi.object({
  firstName: Joi.string().pattern(safeTextRegex).messages(safeTextMessages),
  lastName: Joi.string().pattern(safeTextRegex).messages(safeTextMessages),
  fatherName: Joi.string().pattern(safeTextRegex).messages(safeTextMessages),
  motherName: Joi.string().pattern(safeTextRegex).messages(safeTextMessages),
  nationalCode: Joi.string().pattern(safeTextRegex).messages(safeTextMessages).length(10),
  birthDate: Joi.object({
    day: Joi.string().pattern(safeTextRegex).messages(safeTextMessages),
    month: Joi.string().pattern(safeTextRegex).messages(safeTextMessages),
    year: Joi.string().pattern(safeTextRegex).messages(safeTextMessages),
  }),
  mobileNumber: Joi.string().pattern(safeTextRegex).messages(safeTextMessages),
  parentsMobileNumber: Joi.string().pattern(safeTextRegex).messages(safeTextMessages),
  grade: Joi.string().pattern(safeTextRegex).messages(safeTextMessages),
  schoolType: Joi.string().pattern(safeTextRegex).messages(safeTextMessages),
  major: Joi.string().pattern(safeTextRegex).messages(safeTextMessages),
});
