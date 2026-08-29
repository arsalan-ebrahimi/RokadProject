import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "وارد کردن عنوان رویداد الزامی است"],
    unique: true,
  },
  type: {
    type: String,
    required: [true, "وارد کردن نوع رویداد الزامی است"],
  },
  date: {
    type: String,
    required: [true, "وارد کردن تاریخ رویداد الزامی است"],
  },
  description: {
    type: String,
    required: [true, "نوشتن توضیحات رویداد الزامی است"],
  },
  img: {
    type: String,
    required: [true, "ارسال تصویر رویداد الزامی است"],
  },
  branch: {
    type: [String], 
    required: [true, "مشخص کردن حداقل یک شعبه الزامی است"],
    enum: {
      values: ["دخترانه", "پسرانه"],
      message: "شعبه مدرسه باید 'دخترانه' یا 'پسرانه' باشد",
    },
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: "حداقل یک شعبه باید انتخاب شود"
    }
  },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;