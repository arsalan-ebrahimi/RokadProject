import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "وارد کردن عنوان سایت الزامی است"],
    },
    description: {
      type: String,
      required: [true, "وارد کردن توضیحات سایت الزامی است"],
    },
    keywords: {
      type: String,
      default: "",
    },
    robots: {
      type: String,
      default: "index, follow",
    },
    canonicalUrl: {
      type: String,
      default: "",
    },
    ogTitle: {
      type: String,
      default: "",
    },
    ogDescription: {
      type: String,
      default: "",
    },
    ogImage: {
      type: String,
      default: "",
    },
    ogType: {
      type: String,
      default: "website",
    },
    twitterCard: {
      type: String,
      default: "summary_large_image",
    },
    twitterTitle: {
      type: String,
      default: "",
    },
    twitterDescription: {
      type: String,
      default: "",
    },
    twitterImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Seo = mongoose.model("Seo", seoSchema);
export default Seo;