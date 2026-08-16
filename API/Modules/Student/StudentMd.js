import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "وارد کردن نام کامل الزامی است"],
  },
  job: {
    type: String,
    required: [true, "وارد کردن شغل الزامی است"],
  },
  generation: {
    type: Number,
    required: [true, "تعیین نسل دانش‌آموز الزامی است"],
  },
  img: {
    type: String,
    required: [true, "انتخاب تصویر دانش‌آموز الزامی است"],
  },
  socialLinks: [{
    type: {
      type: String,
      required: [true, "وارد کردن نوع شبکه اجتماعی الزامی است"],
    },
    link: {
      type: String,
      required: [true, "وارد کردن آدرس لینک الزامی است"],
    }
  }]
});

const Student = mongoose.model("Student", studentSchema);
export default Student;