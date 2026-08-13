import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import fetchData from "../../../Utils/fetchData"; 
import { useNavigate, useParams } from "react-router-dom";
import Notify from "../../../Utils/notify";

// Validation schema for updating comments
const commentUpdateSchema = Yup.object({
  author: Yup.string().required("نام نویسنده الزامی است"),
  content: Yup.string().required("متن نظر الزامی است"),
  role: Yup.string().required("نقش نویسنده الزامی است"),
  gender: Yup.string().required("جنسیت الزامی است"),
});

export default function UpdateComment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    author: "",
    content: "",
    role: "",
    gender: "",
  });

  // Fetch comment data on component mount
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
          gender: data.gender || "",
        });
      }
      
      setLoading(false);
    };

    if (id) {
      getCommentData();
    }
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: commentUpdateSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      // Submit updated data via PATCH
      const response = await fetchData(`comment/${id}`, {
        method: "PATCH", 
        body: JSON.stringify(values),
      });

      if (response && (response.success || response.status === "success")) {
        Notify("success", "نظر با موفقیت ویرایش شد!");
        navigate("/comment");
      } else {
        Notify("error", response?.message || "ویرایش با خطا مواجه شد");
      }

      setIsSubmitting(false);
    },
  });

  // Dynamic input styling based on error state
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
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">نقش</label>
              <select
                {...formik.getFieldProps("role")}
                className={`bg-white ${inputClass(formik.touched.role && formik.errors.role)}`}
              >
                <option value="">انتخاب کنید</option>
                <option value="دانش آموز">دانش آموز</option>
                <option value="اولیا">اولیا</option>
                <option value="معلم">معلم</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">جنسیت</label>
            <select
              {...formik.getFieldProps("gender")}
              className={`bg-white w-full md:w-1/2 ${inputClass(formik.touched.gender && formik.errors.gender)}`}
            >
              <option value="">انتخاب کنید</option>
              <option value="مرد">مرد</option>
              <option value="زن">زن</option>
            </select>
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
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-white px-8 py-3 rounded-lg font-medium transition-colors active:scale-95 ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#51b5a5] hover:bg-teal-600"
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