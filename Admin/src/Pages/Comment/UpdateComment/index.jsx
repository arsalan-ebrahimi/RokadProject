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
// Utilities & Constants
// ==========================================
import fetchData from "../../../Utils/fetchData"; 
import Notify from "../../../Utils/notify";
import { DEFAULT_AVATARS } from "../../../Constants/defaultAvatars";
import { getImageUrl } from "../../../Utils/getImageUrl";
import Loading from "../../../Components/Loading"; 

// ----------------------------------------
// Validation Schema
// ----------------------------------------
const commentUpdateSchema = Yup.object({
  author: Yup.string().required("نام نویسنده الزامی است"),
  content: Yup.string().required("متن نظر الزامی است"),
  role: Yup.string().required("نقش نویسنده الزامی است"),
});

// ==========================================
// Component: UpdateComment
// Description: Form to update an existing comment
// ==========================================
export default function UpdateComment() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const [initialValues, setInitialValues] = useState({
    author: "",
    content: "",
    role: "",
    img: null,
  });

  // ----------------------------------------
  // Fetch Data on Mount
  // ----------------------------------------
  useEffect(() => {
    const getCommentData = async () => {
      setLoading(true);
      const response = await fetchData(`comment/${id}`);
      
      let data = null;
      if (response && response.data) {
        data = Array.isArray(response.data) ? response.data[0] : response.data;
      } else if (Array.isArray(response)) {
        data = response[0];
      }

      if (data) {
        setInitialValues({
          author: data.author || "",
          content: data.content || "",
          role: data.role || "",
          img: data.img || null,
        });

        if (data.img) setImagePreview(getImageUrl(data.img));
      }
      setLoading(false);
    };

    if (id) getCommentData();
  }, [id]);

  // ----------------------------------------
  // Formik Setup
  // ----------------------------------------
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: commentUpdateSchema,
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

        const payload = {
          author: values.author,
          content: values.content,
          role: values.role,
          img: finalImageName,
        };

        const response = await fetchData(`comment/${id}`, {
          method: "PATCH", 
          body: JSON.stringify(payload),
        });

        if (response && (response.success || response.status === "success")) {
          Notify("success", "نظر با موفقیت ویرایش شد!");
          navigate("/comment");
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
  const handleCustomImageChange = (e) => {
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
        <h1 className="text-2xl font-bold text-[#1b234d]">ویرایش نظر</h1>
        <button
          type="button"
          onClick={() => navigate("/comment")}
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
                {...formik.getFieldProps("author")}
                className={inputClass(formik.touched.author && formik.errors.author)}
              />
              {formik.touched.author && formik.errors.author && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.author}</div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">نقش</label>
              {/* 🟢 تغییر یافته به اینپوت متنی */}
              <input
                type="text"
                placeholder="مثال: اولیای دانش‌آموز"
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
            <label className="text-sm font-semibold text-gray-700">تغییر آواتار یا آپلود تصویر جدید</label>
            
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
              {imagePreview && (formik.values.img instanceof File || (typeof formik.values.img === "string" && !formik.values.img.startsWith("default-"))) ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <CloudUploadIcon className="text-gray-400" />
                  <p className="text-xs font-medium text-gray-600">آپلود عکس جدید</p>
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