// ==========================================
// Dependencies & Icons
// ==========================================
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// ==========================================
// Utilities
// ==========================================
import fetchData from "../../../Utils/fetchData";
import Notify from "../../../Utils/notify";
import Loading from "../../../Components/Loading"; 

// ----------------------------------------
// Validation Schema for Formik
// ----------------------------------------
const blogValidationSchema = Yup.object({
  title: Yup.string().required("وارد کردن عنوان بلاگ الزامی است"),
  date: Yup.string().required("انتخاب تاریخ انتشار الزامی است"),
  description: Yup.string()
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .required("وارد کردن توضیحات الزامی است"),
  img: Yup.mixed().required("انتخاب تصویر شاخص الزامی است"),
});

// ==========================================
// Component: CreateBlog
// Description: Form to create a new blog and upload its thumbnail
// ==========================================
export default function CreateBlog() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ----------------------------------------
  // Formik Setup
  // ----------------------------------------
  const formik = useFormik({
    initialValues: {
      title: "",
      date: "",
      description: "",
      img: null,
    },
    validationSchema: blogValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("file", values.img);

        const uploadData = await fetchData("upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadData || !uploadData.success) {
          throw new Error(uploadData?.message || "آپلود عکس با خطا مواجه شد");
        }

        const uploadedFilename = uploadData.data;

        const blogPayload = {
          title: values.title,
          date: values.date,
          description: values.description,
          img: uploadedFilename,
        };

        const blogData = await fetchData("blog", {
          method: "POST",
          body: JSON.stringify(blogPayload),
        });

        if (blogData && blogData.success) {
          Notify("success", "بلاگ با موفقیت ثبت شد!");
          window.history.back(); 
        } else {
          throw new Error(blogData?.message || "ثبت بلاگ با خطا مواجه شد");
        }
      } catch (error) {
        Notify("error", error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // ----------------------------------------
  // Handlers & Protections
  // ----------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.name.toLowerCase().startsWith("default-")) {
        Notify("error", "نام فایل مجاز نیست. لطفاً نام فایل را تغییر دهید.");
        e.target.value = ""; 
        return;
      }
      formik.setFieldValue("img", file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const inputClass = (error) =>
    `w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${
      error ? "border-red-500" : "border-gray-300 focus:border-[#51b5a5]"
    }`;

  // ----------------------------------------
  // Render Component
  // ----------------------------------------
  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#1b234d]">افزودن بلاگ جدید</h1>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-[#1b234d] transition-colors font-medium"
        >
          <span>بازگشت</span>
          <ArrowForwardIcon fontSize="small" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-4xl mx-auto">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">عنوان بلاگ</label>
              <input
                type="text"
                placeholder="مثال: معرفی رشته شبکه و نرم افزار"
                {...formik.getFieldProps("title")}
                className={inputClass(formik.touched.title && formik.errors.title)}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.title}</div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">تاریخ انتشار</label>
              <input
                type="text"
                placeholder="مثال: 1404/06/15"
                {...formik.getFieldProps("date")}
                className={inputClass(formik.touched.date && formik.errors.date)}
              />
              {formik.touched.date && formik.errors.date && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.date}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">توضیحات و متن مقاله</label>
            <textarea
              rows="6"
              placeholder="متن کامل بلاگ را اینجا بنویسید..."
              {...formik.getFieldProps("description")}
              className={`resize-y ${inputClass(formik.touched.description && formik.errors.description)}`}
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">تصویر شاخص</label>
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden">
              <input
                id="img"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <CloudUploadIcon className="text-gray-400" fontSize="large" />
                  <p className="text-sm font-medium text-gray-600">برای آپلود تصویر کلیک کنید</p>
                </>
              )}
            </div>
            {formik.touched.img && formik.errors.img && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.img}</div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-white px-8 py-3 rounded-lg font-medium transition-colors active:scale-95 min-w-[150px] flex justify-center items-center ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#51b5a5] hover:bg-teal-600"
              }`}
            >
              {isSubmitting ? <Loading color="#ffffff" size={8} /> : "ثبت و انتشار بلاگ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}