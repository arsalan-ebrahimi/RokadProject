import mongoose from "mongoose";
import dotenv from "dotenv";
import Seo from "./Modules/Seo/SeoMd.js";

dotenv.config({ path: "./config.env" });

const seedSeo = async () => {
  try {
    await mongoose.connect(process.env.DATA_BASE);
    console.log("✅ Connected to Database.");

    const existingSeo = await Seo.findOne();
    
    if (existingSeo) {
      console.log("⚠️ Default SEO settings already exist in the database.");
      process.exit(0);
    }

    await Seo.create({
      title: "رکاد - پلتفرم آموزشی",
      description: "پلتفرم جامع آموزشی و مدیریت دانش‌آموزان رکاد",
      keywords: "رکاد, آموزش, پلتفرم آموزشی, مدرسه آنلاین",
      robots: "index, follow",
      canonicalUrl: "https://rokad.ir",
      ogTitle: "رکاد - پلتفرم آموزشی",
      ogDescription: "پلتفرم جامع آموزشی و مدیریت دانش‌آموزان رکاد",
      ogType: "website",
      twitterCard: "summary_large_image"
    });

    console.log("🎉 Default SEO settings created successfully!");

  } catch (error) {
    console.error("❌ Error seeding SEO:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedSeo();