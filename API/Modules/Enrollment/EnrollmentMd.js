import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  fatherName: {
    type: String,
    required: [true, "Father's name is required"],
  },
  motherName: {
    type: String,
    required: [true, "Mother's name is required"],
  },
  nationalCode: {
    type: String,
    required: [true, "National code is required"],
    unique : true
  },
  birthDate: {
    day: {
      type: String,
      required: [true, "Birth day is required"],
    },
    month: {
      type: String,
      required: [true, "Birth month is required"],
    },
    year: {
      type: String,
      required: [true, "Birth year is required"],
    },
  },
  mobileNumber: {
    type: String,
    required: [true, "Mobile number is required"],
  },
  parentsMobileNumber: {
    type: String,
    required: [true, "Parents mobile number is required"],
  },
  landlineNumber: {
    type: String,
    required: [false, "Landline number is optional"],
  },
  grade: {
    type: String,
    enum: ["دهم", "یازدهم"],
    required: [true, "Grade is required"],
  },
  schoolType: {
    type: String,
    enum: ["هنرستان پسرانه رکاد", "هنرستان دخترانه رکاد"],
    required: [true, "School type is required"],
  },
  major: {
    type: String,
    enum: [
      "تولید و توسعه پایگاه‌های اینترنتی (برنامه نویسی و طراحی سایت)",
      "تولید محتوای چندرسانه‌ای (طراحی گرافیک و تولید محتوای ویدئویی و صوتی)",
    ],
    required: [true, "Major is required"],
  },
});

const Enrollment = mongoose.model(
  "Enrollment",
  enrollmentSchema,
);
export default Enrollment;
