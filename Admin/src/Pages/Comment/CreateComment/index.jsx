// ==========================================
// Dependencies & Libraries
// ==========================================
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// ==========================================
// Utilities & Constants
// ==========================================
import fetchData from "../../../Utils/fetchData";
import Notify from "../../../Utils/notify";
import { DEFAULT_AVATARS } from "../../../Constants/defaultAvatars";
import Loading from "../../../Components/Loading"; 

// ----------------------------------------
// Validation Schema
// ----------------------------------------
const commentValidationSchema = Yup.object({
  author: Yup.string().required("نام نویسنده الزامی است"),
  content: Yup.string().required("متن نظر الزامی است"),
  role: Yup.string().required("نقش نویسنده الزامی است"),
  img: Yup.mixed().required("انتخاب تصویر الزامی است"),
});

// ==========================================
// Component: CreateComment
// Description: Form to create a new comment with custom or default avatars
// ==========================================
export default function CreateComment() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ----------------------------------------
  // Formik Setup
  // ----------------------------------------
  const formik = useFormik({
    initialValues: {
      author: "",
      content: "",
      role: "",
      img: null,
    },
    validationSchema: commentValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let finalImageName = values.img;

        // Upload if custom file selected
        if (values.img instanceof File) {
          const formData = new FormData();
          formData.append("file", values.img);

          const uploadData = await fetchData("upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadData || !uploadData.success) {
            throw new Error(uploadData?.message || "آپلود عکس با خطا مواجه شد");
          }
          finalImageName = uploadData.data;
        }

        const payload = {
          author: values.author,
          content: values.content,
          role: values.role,
          img: finalImageName,
        };

        const response = await fetchData("comment", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response && response.success !== false) {
          Notify("success", "نظر با موفقیت ثبت شد!");
          window.history.back();
        } else {
          throw new Error(response?.message || "ثبت نظر با خطا مواجه شد");
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
  const handleCustomImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Protection against backend conflict
      if (file.name.toLowerCase().startsWith("default-")) {
        Notify("error", "نام فایل مجاز نیست. لطفاً نام فایل را تغییر دهید.");
        e.target.value = ""; 
        return;
      }
      formik.setFieldValue("img", file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSelectDefaultAvatar = (filename) => {
    formik.setFieldValue("img", filename);
    setImagePreview(`/default-avatars/${filename}`);
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
        <h1 className="text-2xl font-bold text-[#1b234d]">افزودن نظر جدید</h1>
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
              <label className="text-sm font-semibold text-gray-700">نام نویسنده</label>
              <input
                type="text"
                placeholder="مثال: محمد محمدی"
                {...formik.getFieldProps("author")}
                className={inputClass(formik.touched.author && formik.errors.author)}
              />
              {formik.touched.author && formik.errors.author && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.author}</div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">نقش</label>
              <input
                type="text"
                placeholder="مثال: پدر دانش آموز"
                {...formik.getFieldProps("role")}
                className={inputClass(formik.touched.role && formik.errors.role)}
              />
              {formik.touched.role && formik.errors.role && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.role}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">متن نظر</label>
            <textarea
              rows="4"
              placeholder="متن نظر را اینجا بنویسید..."
              {...formik.getFieldProps("content")}
              className={`w-full border rounded-lg px-4 py-3 outline-none transition-all resize-y ${
                formik.touched.content && formik.errors.content ? "border-red-500" : "border-gray-300 focus:border-[#51b5a5]"
              }`}
            ></textarea>
            {formik.touched.content && formik.errors.content && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.content}</div>
            )}
          </div>

          {/* Avatar Selection Area */}
          <div className="flex flex-col gap-4 border-t pt-4">
            <label className="text-sm font-semibold text-gray-700">انتخاب آواتار یا آپلود تصویر شخصی</label>
            
            <div className="flex gap-4 flex-wrap">
              {DEFAULT_AVATARS.map((avatar) => (
                <img 
                  key={`avatar-${avatar.id}`}
                  src={`/default-avatars/${avatar.filename}`} 
                  alt={avatar.alt}
                  onClick={() => handleSelectDefaultAvatar(avatar.filename)}
                  className={`w-14 h-14 object-cover rounded-full cursor-pointer transition-all hover:scale-105 border-2 ${
                    formik.values.img === avatar.filename ? "border-[#51b5a5] shadow-md" : "border-transparent"
                  }`}
                />
              ))}
            </div>

            <span className="text-xs text-gray-400 font-bold my-1">یا</span>

            <div className="w-full md:w-1/2 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden">
              <input
                id="custom-img"
                type="file"
                accept="image/*"
                onChange={handleCustomImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imagePreview && formik.values.img instanceof File ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <CloudUploadIcon className="text-gray-400" />
                  <p className="text-xs font-medium text-gray-600">آپلود عکس شخصی</p>
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
              {isSubmitting ? <Loading color="#ffffff" size={8} /> : "ثبت نظر"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}