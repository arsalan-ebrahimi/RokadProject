import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import fetchData from "../../../Utils/fetchData";
import Notify from "../../../Utils/notify";

// Validation rules for new blog entry
const blogValidationSchema = Yup.object({
  title: Yup.string().required("وارد کردن عنوان بلاگ الزامی است"),
  date: Yup.string().required("انتخاب تاریخ انتشار الزامی است"),
  description: Yup.string()
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .required("وارد کردن توضیحات الزامی است"),
  img: Yup.mixed().required("انتخاب تصویر شاخص الزامی است"),
});

export default function CreateBlog() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // Step 1: Upload image file
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

        // Step 2: Create blog post with image filename
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("img", file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

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
              <label htmlFor="title" className="text-sm font-semibold text-gray-700">عنوان بلاگ</label>
              <input
                id="title"
                type="text"
                placeholder="مثال: معرفی رشته شبکه و نرم افزار"
                {...formik.getFieldProps("title")}
                className={`w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${
                  formik.touched.title && formik.errors.title ? "border-red-500" : "border-gray-300 focus:border-[#51b5a5]"
                }`}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.title}</div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">تاریخ انتشار</label>
              <input
                id="date"
                type="text"
                {...formik.getFieldProps("date")}
                className={`w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${
                  formik.touched.date && formik.errors.date ? "border-red-500" : "border-gray-300 focus:border-[#51b5a5]"
                }`}
              />
              {formik.touched.date && formik.errors.date && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.date}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-semibold text-gray-700">توضیحات و متن مقاله</label>
            <textarea
              id="description"
              rows="6"
              placeholder="متن کامل بلاگ را اینجا بنویسید..."
              {...formik.getFieldProps("description")}
              className={`w-full border rounded-lg px-4 py-3 outline-none transition-all resize-y ${
                formik.touched.description && formik.errors.description ? "border-red-500" : "border-gray-300 focus:border-[#51b5a5]"
              }`}
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
                name="img"
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
                  <div className="text-center px-4">
                    <p className="text-sm font-medium text-gray-600">برای آپلود تصویر کلیک کنید</p>
                  </div>
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
              {isSubmitting ? "در حال ثبت..." : "ثبت و انتشار بلاگ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}