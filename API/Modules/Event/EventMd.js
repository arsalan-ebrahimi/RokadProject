import mongoose from "mongoose";
import { slugify } from "../../Utils/slugify.js";

const organizerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام عضو کادر الزامی است"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "نقش عضو کادر الزامی است"],
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: ["منتور", "عوامل اجرایی", "داور"],
        message: "دسته‌بندی باید یکی از موارد 'منتور'، 'عوامل اجرایی' یا 'داور' باشد",
      },
      required: [true, "انتخاب دسته‌بندی نقش الزامی است"],
    },
  },
  { _id: true }
);

const deadlineItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان ددلاین الزامی است"],
      trim: true,
    },
    date: {
      type: String,
      default: "",
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

const honoredTeamItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام تیم شایسته تقدیر الزامی است"],
      trim: true,
    },
  },
  { _id: true }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "وارد کردن عنوان رویداد الزامی است"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    type: {
      type: String,
      required: [true, "وارد کردن نوع رویداد الزامی است"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "وارد کردن تاریخ رویداد الزامی است"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "نوشتن توضیحات رویداد الزامی است"],
      trim: true,
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
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "حداقل یک شعبه باید انتخاب شود",
      },
    },

    // Extended event details
    eventDuration: {
      type: String,
      default: "",
      trim: true,
    },
    closingLocation: {
      type: String,
      default: "",
      trim: true,
    },
    holdingDate: {
      type: String,
      default: "",
      trim: true,
    },

    // Organizers: Mentors, Executive staff, Judges (minimum 3 required on creation)
    organizers: {
      type: [organizerSchema],
      default: [],
    },

    // Competition Teams: Podiums with isHonored toggle + dynamic honored teams
    teams: {
      firstTeam: {
        name: { type: String, default: "", trim: true },
        isHonored: { type: Boolean, default: false },
      },
      secondTeam: {
        name: { type: String, default: "", trim: true },
        isHonored: { type: Boolean, default: false },
      },
      thirdTeam: {
        name: { type: String, default: "", trim: true },
        isHonored: { type: Boolean, default: false },
      },
      honoredTeams: {
        type: [honoredTeamItemSchema],
        default: [],
      },
    },

    // How the event went
    howItWent: {
      type: String,
      default: "",
      trim: true,
    },

    // Memorable quote and speaker
    memorableQuote: {
      quote: { type: String, default: "", trim: true },
      speaker: { type: String, default: "", trim: true },
    },

    // Deadlines
    deadlinesDescription: {
      type: String,
      default: "",
      trim: true,
    },
    deadlines: {
      type: [deadlineItemSchema],
      default: [],
    },

    // Tags
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  } else if (this.slug) {
    this.slug = slugify(this.slug);
  }
  next();
});

eventSchema.index({ slug: 1 }, { unique: true, sparse: true });
eventSchema.index({ createdAt: -1 });

const Event = mongoose.model("Event", eventSchema);
export default Event;