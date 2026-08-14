// ==========================================
// Dependencies & Libraries
// ==========================================
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate, useParams } from "react-router-dom";

// ==========================================
// Utilities
// ==========================================
import fetchData from "../../../Utils/fetchData";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";

// ----------------------------------------
// Validation Schema for Formik
// ----------------------------------------
const eventUpdateSchema = Yup.object({
  title: Yup.string().required("عنوان رویداد الزامی است"),
  type: Yup.string().required("نوع رویداد الزامی است"),
  date: Yup.string().required("تاریخ رویداد الزامی است"),
  description: Yup.string().required("توضیحات رویداد الزامی است"),
  branch: Yup.string()
    .oneOf(["دخترانه", "پسرانه"], "شعبه باید انتخاب شود")
    .required("مشخص کردن شعبه الزامی است"),
});

// ==========================================
// Component: UpdateEvent
// Description: Form to update existing event
// ==========================================
export default function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    title: "",
    type: "",
    date: "",
    description: "",
    branch: "",
    img: null,
  });

  // ----------------------------------------
  // Fetch Existing Data on Mount
  // ----------------------------------------
  useEffect(() => {
    const getEventData = async () => {
      setLoading(true);
      const response = await fetchData(`event/${id}`);
      
      let data = null;
      if (response && response.data) {
        data = Array.isArray(response.data) ? response.data[0] : response.data;
      } else if (Array.isArray(response)) {
        data = response[0];
      }

      if (data) {
        setInitialValues({
          title: data.title || "",
          type: data.type || "",
          date: data.date || "",
          description: data.description || "",
          branch: data.branch || "",
          img: data.img || null,
        });

        // Use helper to set the preview URL
        if (data.img) setImagePreview(getImageUrl(data.img));
      }
      
      setLoading(false);
    };

    if (id) getEventData();
  }, [id]);

  // ----------------------------------------
  // Formik Setup
  // ----------------------------------------
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: eventUpdateSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let finalImageName = values.img;

        // If user selected a new custom file
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

        const payload = {
          title: values.title,
          type: values.type,
          date: values.date,
          description: values.description,
          branch: values.branch,
          img: finalImageName,
        };

        const response = await fetchData(`event/${id}`, {
          method: "PATCH", 
          body: JSON.stringify(payload),
        });

        if (response && (response.success || response.status === "success")) {
          Notify("success", "رویداد با موفقیت ویرایش شد!");
          navigate("/event");
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
        <p className="text-gray-500 text-lg">در حال بارگذاری اطلاعات...</p>
      </div>
    );
  }

  // ----------------------------------------
  // Render Component
  // ----------------------------------------
  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#1b234d]">ویرایش رویداد</h1>
        <button
          type="button"
          onClick={() => navigate("/event")}
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
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">نوع رویداد</label>
              <input
                type="text"
                {...formik.getFieldProps("type")}
                className={inputClass(formik.touched.type && formik.errors.type)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">تاریخ انتشار</label>
              <input
                type="text"
                {...formik.getFieldProps("date")}
                className={inputClass(formik.touched.date && formik.errors.date)}
              />
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
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">توضیحات</label>
            <textarea
              rows="5"
              {...formik.getFieldProps("description")}
              className={`resize-y ${inputClass(formik.touched.description && formik.errors.description)}`}
            ></textarea>
          </div>

          {/* Image Upload Area */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">تغییر تصویر رویداد</label>
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
                  <p className="text-sm font-medium text-gray-600">برای تغییر تصویر کلیک کنید</p>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-white px-8 py-3 rounded-lg font-medium transition-colors active:scale-95 ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}