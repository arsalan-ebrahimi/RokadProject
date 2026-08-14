// ==========================================
// Dependencies & Libraries
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

// ----------------------------------------
// Validation Schema
// ----------------------------------------
const eventValidationSchema = Yup.object({
  title: Yup.string().required("عنوان رویداد الزامی است"),
  type: Yup.string().required("نوع رویداد الزامی است"),
  date: Yup.string().required("تاریخ رویداد الزامی است"),
  description: Yup.string().required("توضیحات رویداد الزامی است"),
  branch: Yup.string()
    .oneOf(["دخترانه", "پسرانه"], "شعبه باید انتخاب شود")
    .required("مشخص کردن شعبه الزامی است"),
  img: Yup.mixed().required("انتخاب تصویر رویداد الزامی است"),
});

// ==========================================
// Component: CreateEvent
// Description: Form to create a new event with image upload
// ==========================================
export default function CreateEvent() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ----------------------------------------
  // Formik Setup
  // ----------------------------------------
  const formik = useFormik({
    initialValues: {
      title: "",
      type: "",
      date: "",
      description: "",
      branch: "",
      img: null,
    },
    validationSchema: eventValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Step 1: Upload Image
        const formData = new FormData();
        formData.append("file", values.img);

        const uploadData = await fetchData("upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadData || !uploadData.success) {
          throw new Error(uploadData?.message || "آپلود تصویر با خطا مواجه شد");
        }

        const uploadedFilename = uploadData.data;

        // Step 2: Save Event Data
        const payload = {
          title: values.title,
          type: values.type,
          date: values.date,
          description: values.description,
          branch: values.branch,
          img: uploadedFilename,
        };

        const response = await fetchData("event", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response && response.success !== false) {
          Notify("success", "رویداد با موفقیت ثبت شد!");
          window.history.back(); 
        } else {
          throw new Error(response?.message || "ثبت رویداد با خطا مواجه شد");
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
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
        <h1 className="text-2xl font-bold text-[#1b234d]">افزودن رویداد جدید</h1>
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
              <label className="text-sm font-semibold text-gray-700">عنوان رویداد</label>
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
              <label className="text-sm font-semibold text-gray-700">نوع رویداد</label>
              <input
                type="text"
                placeholder="مثال: مسابقه، همایش"
                {...formik.getFieldProps("type")}
                className={inputClass(formik.touched.type && formik.errors.type)}
              />
              {formik.touched.type && formik.errors.type && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.type}</div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">تاریخ رویداد</label>
              <input
                type="text"
                placeholder="مثال: 1404/05/20"
                {...formik.getFieldProps("date")}
                className={inputClass(formik.touched.date && formik.errors.date)}
              />
              {formik.touched.date && formik.errors.date && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.date}</div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">شعبه</label>
              <select
                {...formik.getFieldProps("branch")}
                className={`bg-white ${inputClass(formik.touched.branch && formik.errors.branch)}`}
              >
                <option value="">انتخاب کنید</option>
                <option value="دخترانه">دخترانه</option>
                <option value="پسرانه">پسرانه</option>
              </select>
              {formik.touched.branch && formik.errors.branch && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.branch}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">توضیحات</label>
            <textarea
              rows="5"
              {...formik.getFieldProps("description")}
              className={`resize-y ${inputClass(formik.touched.description && formik.errors.description)}`}
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
            )}
          </div>

          {/* Image Upload Area */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">تصویر رویداد</label>
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
              className={`text-white px-8 py-3 rounded-lg font-medium transition-colors active:scale-95 ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#51b5a5] hover:bg-teal-600"
              }`}
            >
              {isSubmitting ? "در حال ثبت..." : "ثبت رویداد"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}