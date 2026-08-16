// ==========================================
// Dependencies & Libraries
// ==========================================
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// ==========================================
// Utilities
// ==========================================
import fetchData from "../../../Utils/fetchData";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import Loading from "../../../Components/Loading"; 

// ----------------------------------------
// Validation Schema for Formik
// ----------------------------------------
const blogUpdateSchema = Yup.object({
  title: Yup.string().required("وارد کردن عنوان بلاگ الزامی است"),
  date: Yup.string().required("انتخاب تاریخ انتشار الزامی است"),
  description: Yup.string()
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .required("وارد کردن توضیحات الزامی است"),
});

// ==========================================
// Component: UpdateBlog
// ==========================================
export default function UpdateBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [initialValues, setInitialValues] = useState({
    title: "",
    date: "",
    description: "",
    img: null,
  });

  // ----------------------------------------
  // Fetch Existing Blog Data
  // ----------------------------------------
  useEffect(() => {
    const getBlogData = async () => {
      setLoading(true);
      const response = await fetchData(`blog/${id}`);
      
      let data = null;
      if (response && response.data) {
           data = Array.isArray(response.data) ? response.data[0] : response.data;
      } else if (Array.isArray(response)) {
           data = response[0];
      }

      if (data) {
        setInitialValues({
          title: data.title || "",
          date: data.date || "",
          description: data.description || "",
          img: data.img || null,
        });

        if (data.img) setImagePreview(getImageUrl(data.img));
      }
      setLoading(false);
    };

    if (id) getBlogData();
  }, [id]);

  // ----------------------------------------
  // Formik Setup
  // ----------------------------------------
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: blogUpdateSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let finalImageName = values.img;

        if (values.img instanceof File) {
          const formData = new FormData();
          formData.append("file", values.img);

          const uploadData = await fetchData("upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadData || !uploadData.success) {
            throw new Error(uploadData?.message || "آپلود تصویر با خطا مواجه شد");
          }
          finalImageName = uploadData.data;
        }

        const blogPayload = {
          title: values.title,
          date: values.date,
          description: values.description,
          img: finalImageName,
        };

        const response = await fetchData(`blog/${id}`, {
          method: "PATCH", 
          body: JSON.stringify(blogPayload),
        });

        if (response && (response.success || response.status === "success")) {
          Notify("success", "بلاگ با موفقیت ویرایش شد!");
          navigate("/blog"); 
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

  if (loading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loading size={12} />
      </div>
    );
  }

  // ----------------------------------------
  // Render Component
  // ----------------------------------------
  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#1b234d]">ویرایش بلاگ</h1>
        <button
          type="button"
          onClick={() => navigate("/blog")}
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
              {...formik.getFieldProps("description")}
              className={`resize-y ${inputClass(formik.touched.description && formik.errors.description)}`}
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t pt-4">
            <label className="text-sm font-semibold text-gray-700">تغییر تصویر شاخص</label>
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden">
              <input
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
                  <p className="text-sm font-medium text-gray-600">برای تغییر تصویر کلیک کنید</p>
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
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? <Loading color="#ffffff" size={8} /> : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}