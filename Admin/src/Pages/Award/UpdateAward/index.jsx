import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import fetchData from "../../../Utils/fetchData";
import { useNavigate, useParams } from "react-router-dom";
import Notify from "../../../Utils/notify";

// Validation schema for updating awards
const awardUpdateSchema = Yup.object({
  title: Yup.string().required("عنوان جایزه الزامی است"),
});

export default function UpdateAward() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    title: "",
  });

  // Fetch award data on component mount
  useEffect(() => {
    const getAwardData = async () => {
      setLoading(true);
      
      const response = await fetchData(`award/${id}`);
      
      let awardData = null;
      if (response && response.data) {
        awardData = Array.isArray(response.data) ? response.data[0] : response.data;
      } else if (Array.isArray(response)) {
        awardData = response[0];
      }

      if (awardData) {
        setInitialValues({
          title: awardData.title || "",
        });
      }
      
      setLoading(false);
    };

    if (id) {
      getAwardData();
    }
  }, [id, navigate]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: awardUpdateSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      // Perform PATCH request to update award
      const response = await fetchData(`award/${id}`, {
        method: "PATCH", 
        body: JSON.stringify(values),
      });

      if (response && (response.success || response.status === "success")) {
        Notify("success", "جایزه با موفقیت ویرایش شد!");
        navigate("/award");
      } else {
        Notify("error", response?.message || "ویرایش با خطا مواجه شد");
      }

      setIsSubmitting(false);
    },
  });

  // Render loading state
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
        <h1 className="text-2xl font-bold text-[#1b234d]">ویرایش جایزه</h1>
        <button
          type="button"
          onClick={() => navigate("/award")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#1b234d] transition-colors font-medium"
        >
          <span>بازگشت</span>
          <ArrowForwardIcon fontSize="small" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-4xl mx-auto">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-semibold text-gray-700">عنوان جایزه</label>
            <input
              id="title"
              type="text"
              {...formik.getFieldProps("title")}
              className={`w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${
                formik.touched.title && formik.errors.title ? "border-red-500" : "border-gray-300 focus:border-[#51b5a5]"
              }`}
            />
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.title}</div>
            )}
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