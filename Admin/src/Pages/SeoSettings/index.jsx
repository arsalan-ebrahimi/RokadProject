import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

// ==========================================
// Utilities & Constants
// ==========================================
import fetchData from "../../Utils/fetchData"; 
import Notify from "../../Utils/notify";
import Loading from "../../Components/Loading"; 

// ----------------------------------------
// Validation Schema
// ----------------------------------------
const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_()،,.\u200C]+$/;
const SeoSchema = Yup.object({
  title: Yup.string().matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست").required("وارد کردن عنوان سایت الزامی است"),
  description: Yup.string().matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست").required("وارد کردن توضیحات سایت الزامی است"),
  keywords: Yup.string().matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست"),
  robots: Yup.string(),
  canonicalUrl: Yup.string(),
  ogTitle: Yup.string().matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست"),
  ogDescription: Yup.string().matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست"),
  ogImage: Yup.string(),
  ogType: Yup.string(),
  twitterCard: Yup.string(),
  twitterTitle: Yup.string().matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست"),
  twitterDescription: Yup.string().matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست"),
  twitterImage: Yup.string(),
});

// ==========================================
// Component: SeoSettings
// Description: Form to manage global SEO settings
// ==========================================
export default function SeoSettings() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form initial state
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    keywords: "",
    robots: "index, follow",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  });

  // ----------------------------------------
  // Fetch Data on Mount
  // ----------------------------------------
  useEffect(() => {
    const getSeoData = async () => {
      setLoading(true);
      try {
        const response = await fetchData("seo");
        
        let data = null;
        if (response && response.data) {
          data = Array.isArray(response.data) ? response.data[0] : response.data;
        } else if (Array.isArray(response)) {
          data = response[0];
        }

        if (data) {
          setInitialValues({
            title: data.title || "",
            description: data.description || "",
            keywords: data.keywords || "",
            robots: data.robots || "index, follow",
            canonicalUrl: data.canonicalUrl || "",
            ogTitle: data.ogTitle || "",
            ogDescription: data.ogDescription || "",
            ogImage: data.ogImage || "",
            ogType: data.ogType || "website",
            twitterCard: data.twitterCard || "summary_large_image",
            twitterTitle: data.twitterTitle || "",
            twitterDescription: data.twitterDescription || "",
            twitterImage: data.twitterImage || "",
          });
        }
      } catch (error) {
        console.error("Fetch SEO Error:", error);
        Notify("error", "خطا در ارتباط با سرور");
      }
      setLoading(false);
    };

    getSeoData();
  }, []);

  // ----------------------------------------
  // Formik Setup
  // ----------------------------------------
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: SeoSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await fetchData("seo", {
          method: "PATCH", 
          body: JSON.stringify(values),
        });

        if (response && (response.success || response.status === "success")) {
          Notify("success", "تنظیمات سئو با موفقیت بروزرسانی شد!");
        } else {
          throw new Error(response?.message || "ویرایش با خطا مواجه شد");
        }
      } catch (error) {
        Notify("error", error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // ----------------------------------------
  // Handlers
  // ----------------------------------------
  const inputClass = (error) =>
    `w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${
      error ? "border-red-500" : "border-gray-300 focus:border-primary"
    }`;

  // ----------------------------------------
  // Render Component
  // ----------------------------------------
  if (loading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loading size={12} />
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-secondary">مدیریت سئو سایت (SEO)</h1>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-secondary transition-colors font-medium"
        >
          <span>بازگشت به داشبورد</span>
          <ArrowForwardIcon fontSize="small" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-4xl mx-auto">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
          
          {/* Basic SEO Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-secondary border-b pb-2">تنظیمات پایه (Basic SEO)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">عنوان سایت (Title)</label>
                <input 
                  type="text" 
                  {...formik.getFieldProps("title")} 
                  className={inputClass(formik.touched.title && formik.errors.title)} 
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.title}</div>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">ربات‌ها (Robots)</label>
                <input 
                  type="text" 
                  placeholder="مثال: index, follow"
                  {...formik.getFieldProps("robots")} 
                  className={inputClass(formik.touched.robots && formik.errors.robots)} 
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">توضیحات (Description)</label>
                <textarea 
                  rows="3" 
                  {...formik.getFieldProps("description")} 
                  className={`w-full border rounded-lg px-4 py-3 outline-none transition-all resize-y ${
                    formik.touched.description && formik.errors.description ? "border-red-500" : "border-gray-300 focus:border-primary"
                  }`}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
                )}
              </div>
              
              <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">کلمات کلیدی (Keywords)</label>
                <input 
                  type="text" 
                  placeholder="کلمات را با کاما جدا کنید"
                  {...formik.getFieldProps("keywords")} 
                  className={inputClass(formik.touched.keywords && formik.errors.keywords)} 
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">آدرس کنونیکال (Canonical URL)</label>
                <input 
                  type="text" 
                  dir="ltr" 
                  placeholder="https://..."
                  {...formik.getFieldProps("canonicalUrl")} 
                  className={`text-left ${inputClass(formik.touched.canonicalUrl && formik.errors.canonicalUrl)}`} 
                />
              </div>
            </div>
          </div>

          {/* Open Graph Section */}
          <div className="flex flex-col gap-4 border-t pt-6">
            <h2 className="text-lg font-bold text-secondary border-b pb-2">تنظیمات شبکه‌های اجتماعی (Open Graph)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">عنوان (OG Title)</label>
                <input 
                  type="text" 
                  {...formik.getFieldProps("ogTitle")} 
                  className={inputClass(formik.touched.ogTitle && formik.errors.ogTitle)} 
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">نوع (OG Type)</label>
                <input 
                  type="text" 
                  placeholder="مثال: website"
                  {...formik.getFieldProps("ogType")} 
                  className={inputClass(formik.touched.ogType && formik.errors.ogType)} 
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">توضیحات (OG Description)</label>
                <textarea 
                  rows="2" 
                  {...formik.getFieldProps("ogDescription")} 
                  className={`w-full border rounded-lg px-4 py-3 outline-none transition-all resize-y ${
                    formik.touched.ogDescription && formik.errors.ogDescription ? "border-red-500" : "border-gray-300 focus:border-primary"
                  }`}
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">لینک تصویر (OG Image)</label>
                <input 
                  type="text" 
                  dir="ltr" 
                  placeholder="https://..."
                  {...formik.getFieldProps("ogImage")} 
                  className={`text-left ${inputClass(formik.touched.ogImage && formik.errors.ogImage)}`} 
                />
              </div>
            </div>
          </div>

          {/* Twitter Cards Section */}
          <div className="flex flex-col gap-4 border-t pt-6">
            <h2 className="text-lg font-bold text-secondary border-b pb-2">تنظیمات توییتر (Twitter Cards)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">نوع کارت (Twitter Card)</label>
                <input 
                  type="text" 
                  placeholder="مثال: summary_large_image"
                  {...formik.getFieldProps("twitterCard")} 
                  className={inputClass(formik.touched.twitterCard && formik.errors.twitterCard)} 
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">عنوان توییتر (Twitter Title)</label>
                <input 
                  type="text" 
                  {...formik.getFieldProps("twitterTitle")} 
                  className={inputClass(formik.touched.twitterTitle && formik.errors.twitterTitle)} 
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">توضیحات توییتر (Twitter Description)</label>
                <textarea 
                  rows="2" 
                  {...formik.getFieldProps("twitterDescription")} 
                  className={`w-full border rounded-lg px-4 py-3 outline-none transition-all resize-y ${
                    formik.touched.twitterDescription && formik.errors.twitterDescription ? "border-red-500" : "border-gray-300 focus:border-primary"
                  }`}
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">لینک تصویر توییتر (Twitter Image)</label>
                <input 
                  type="text" 
                  dir="ltr" 
                  placeholder="https://..."
                  {...formik.getFieldProps("twitterImage")} 
                  className={`text-left ${inputClass(formik.touched.twitterImage && formik.errors.twitterImage)}`} 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 border-t pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-white px-8 py-3 rounded-lg font-medium transition-colors active:scale-95 min-w-btn-wide flex justify-center items-center ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? <Loading color="var(--color-white)" size={8} /> : "ذخیره تغییرات سئو"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}