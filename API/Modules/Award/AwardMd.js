import mongoose from "mongoose";

const awardSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: [true, "وارد کردن عنوان جایزه الزامی است"],
  },
  rank: {
    type: Number,
    required: [true, "تعیین مقام الزامی است"],
    enum: {
      values: [1, 2, 3],
      message: "مقام باید یکی از اعداد 1، 2 یا 3 باشد"
    },
  },
  description: {
    type: String,
    required: [true, "نوشتن توضیحات الزامی است"],
  },
  winners: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    }],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: "حداقل یک برنده باید انتخاب شود"
    }
  }
});

const Award = mongoose.model("Award", awardSchema);
export default Award;