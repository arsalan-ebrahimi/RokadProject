// ==========================================
// Dependencies & Libraries
// ==========================================
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// ==========================================
// Utilities & Components
// ==========================================
import fetchData from "../../../Utils/fetchData";
import Notify from "../../../Utils/notify";
import Loading from "../../../Components/Loading";

// ----------------------------------------
// Validation Schema
// ----------------------------------------
const awardValidationSchema = Yup.object({
  title: Yup.string().required("عنوان جایزه الزامی است"),
});

// ==========================================
// Component: CreateAward
// Description: Form to create a new award
// ==========================================
export default function CreateAward() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ----------------------------------------
  // Formik Configuration
  // ----------------------------------------
  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema: awardValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      
      const response = await fetchData("award", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (response && response.success !== false) {
        Notify("success", "جایزه با موفقیت ثبت شد!");
        window.history.back(); 
      } else {
        Notify("error", response?.message || "ثبت جایزه با خطا مواجه شد");
      }
      
      setIsSubmitting(false);
    },
  });

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
        <h1 className="text-2xl font-bold text-[#1b234d]">افزودن جایزه جدید</h1>
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
          
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-semibold text-gray-700">عنوان جایزه</label>
            <input
              id="title"
              type="text"
              placeholder="مثال: تندیس کارآفرین برتر"
              {...formik.getFieldProps("title")}
              className={inputClass(formik.touched.title && formik.errors.title)}
            />
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.title}</div>
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
              {isSubmitting ? <Loading color="#ffffff" size={8} /> : "ثبت جایزه"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}