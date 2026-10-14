import mongoose from "mongoose";

const keyActivityItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان فعالیت الزامی است"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "وارد کردن نام کامل الزامی است"],
      trim: true,
    },
    job: {
      type: String,
      required: [true, "وارد کردن وضعیت شغلی فعلی الزامی است"],
      trim: true,
    },
    generation: {
      type: Number,
      required: [true, "تعیین نسل دانش‌آموز الزامی است"],
    },
    schoolType: {
      type: String,
      required: [true, "وارد کردن نوع مدرسه الزامی است"],
      trim: true,
    },
    major: {
      type: String,
      required: [true, "وارد کردن رشته تحصیلی الزامی است"],
      trim: true,
    },
    img: {
      type: String,
      required: [true, "انتخاب تصویر دانش‌آموز الزامی است"],
    },
    socialLinks: [
      {
        type: {
          type: String,
          required: [true, "وارد کردن نوع شبکه اجتماعی الزامی است"],
          trim: true,
        },
        link: {
          type: String,
          required: [true, "وارد کردن آدرس لینک الزامی است"],
          trim: true,
        },
      },
    ],

    // Extended student profile & dossier fields
    about: {
      type: String,
      default: "",
      trim: true,
    },
    rokadStory: {
      type: String,
      default: "",
      trim: true,
    },
    achievements: {
      type: String,
      default: "",
      trim: true,
    },
    keyActivities: {
      type: [keyActivityItemSchema],
      default: [],
    },

    // Identity Card (شناسنامه دانش‌آموز) fields
    currentCity: {
      type: String,
      default: "",
      trim: true,
    },
    graduationYear: {
      type: String,
      default: "",
      trim: true,
    },
    portfolioCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;