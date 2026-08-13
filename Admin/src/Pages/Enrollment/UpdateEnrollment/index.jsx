import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import fetchData from "../../../Utils/fetchData"; 
import { useNavigate, useParams } from "react-router-dom";
import Notify from "../../../Utils/notify";

// Form validation schema using Yup
const enrollmentValidationSchema = Yup.object({
  firstName: Yup.string().required("نام الزامی است"),
  lastName: Yup.string().required("نام خانوادگی الزامی است"),
  fatherName: Yup.string().required("نام پدر الزامی است"),
  motherName: Yup.string().required("نام مادر الزامی است"),
  nationalCode: Yup.string().length(10, "کد ملی باید ۱۰ رقم باشد").required("کد ملی الزامی است"),
  birthDate: Yup.object({
    day: Yup.string().required("روز"),
    month: Yup.string().required("ماه"),
    year: Yup.string().required("سال"),
  }),
  mobileNumber: Yup.string().required("موبایل دانش‌آموز الزامی است"),
  parentsMobileNumber: Yup.string().required("موبایل والدین الزامی است"),
  grade: Yup.string().required("پایه تحصیلی الزامی است"),
  schoolType: Yup.string().required("نوع مدرسه الزامی است"),
  major: Yup.string().required("رشته تحصیلی الزامی است"),
});

export default function UpdateEnrollment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form initial state
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    nationalCode: "",
    birthDate: { day: "", month: "", year: "" },
    mobileNumber: "",
    parentsMobileNumber: "",
    landlineNumber: "",
    grade: "",
    schoolType: "",
    major: "",
  });

  // Fetch existing enrollment data to populate the form
  useEffect(() => {
    const getEnrollmentData = async () => {
      setLoading(true);
      const response = await fetchData(`enrollment/${id}`);
      
      let data = null;
      if (response && response.data) {
        data = Array.isArray(response.data) ? response.data[0] : response.data;
      } else if (Array.isArray(response)) {
        data = response[0];
      }

      if (data) {
        setInitialValues({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          fatherName: data.fatherName || "",
          motherName: data.motherName || "",
          nationalCode: data.nationalCode || "",
          birthDate: {
            day: data.birthDate?.day || "",
            month: data.birthDate?.month || "",
            year: data.birthDate?.year || "",
          },
          mobileNumber: data.mobileNumber || "",
          parentsMobileNumber: data.parentsMobileNumber || "",
          landlineNumber: data.landlineNumber || "",
          grade: data.grade || "",
          schoolType: data.schoolType || "",
          major: data.major || "",
        });
      }
      setLoading(false);
    };

    if (id) getEnrollmentData();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: enrollmentValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      
      // Send partial update request to server
      const response = await fetchData(`enrollment/${id}`, {
        method: "PATCH", 
        body: JSON.stringify(values),
      });

      if (response && (response.success || response.status === "success")) {
        Notify("success", "اطلاعات با موفقیت ویرایش شد!");
        navigate("/enrollment");
      } else {
        Notify("error", response?.message || "خطا در ویرایش اطلاعات");
      }
      
      setIsSubmitting(false);
    },
  });

  // Helper function for dynamic tailwind classes based on validation
  const inputClass = (error) =>
    `w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${
      error ? "border-red-500" : "border-gray-300 focus:border-[#1b234d]"
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
      {/* Header section with back navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#1b234d]">ویرایش پیش‌ثبت‌نام</h1>
        <button
          type="button"
          onClick={() => navigate("/enrollment")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#1b234d] transition-colors font-medium"
        >
          <span>بازگشت</span>
          <ArrowForwardIcon fontSize="small" />
        </button>
      </div>

      {/* Main Form container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-5xl mx-auto">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          
          {/* Personal Information Section */}
          <h2 className="text-lg font-bold text-gray-700 border-b pb-2">اطلاعات فردی</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">نام</label>
              <input type="text" {...formik.getFieldProps("firstName")} className={inputClass(formik.touched.firstName && formik.errors.firstName)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">نام خانوادگی</label>
              <input type="text" {...formik.getFieldProps("lastName")} className={inputClass(formik.touched.lastName && formik.errors.lastName)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">نام پدر</label>
              <input type="text" {...formik.getFieldProps("fatherName")} className={inputClass(formik.touched.fatherName && formik.errors.fatherName)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">نام مادر</label>
              <input type="text" {...formik.getFieldProps("motherName")} className={inputClass(formik.touched.motherName && formik.errors.motherName)} />
            </div>
          </div>

          {/* National ID and Birth Date inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">کد ملی</label>
              <input type="text" maxLength={10} {...formik.getFieldProps("nationalCode")} className={inputClass(formik.touched.nationalCode && formik.errors.nationalCode)} />
            </div>
            <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">تاریخ تولد</label>
                <div className="flex gap-4">
                    <input placeholder="روز" {...formik.getFieldProps("birthDate.day")} className={`w-1/3 ${inputClass(formik.touched.birthDate?.day && formik.errors.birthDate?.day)}`} />
                    <input placeholder="ماه" {...formik.getFieldProps("birthDate.month")} className={`w-1/3 ${inputClass(formik.touched.birthDate?.month && formik.errors.birthDate?.month)}`} />
                    <input placeholder="سال" {...formik.getFieldProps("birthDate.year")} className={`w-1/3 ${inputClass(formik.touched.birthDate?.year && formik.errors.birthDate?.year)}`} />
                </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <h2 className="text-lg font-bold text-gray-700 border-b pb-2 mt-4">اطلاعات تماس</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">موبایل دانش‌آموز</label>
              <input type="tel" {...formik.getFieldProps("mobileNumber")} className={inputClass(formik.touched.mobileNumber && formik.errors.mobileNumber)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">موبایل والدین</label>
              <input type="tel" {...formik.getFieldProps("parentsMobileNumber")} className={inputClass(formik.touched.parentsMobileNumber && formik.errors.parentsMobileNumber)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">تلفن ثابت</label>
              <input type="tel" {...formik.getFieldProps("landlineNumber")} className={inputClass(false)} />
            </div>
          </div>

          {/* Educational Information Section */}
          <h2 className="text-lg font-bold text-gray-700 border-b pb-2 mt-4">اطلاعات تحصیلی</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">نوع مدرسه</label>
              <select {...formik.getFieldProps("schoolType")} className={`bg-white ${inputClass(formik.touched.schoolType && formik.errors.schoolType)}`}>
                <option value="">انتخاب کنید</option>
                <option value="هنرستان پسرانه رکاد">هنرستان پسرانه رکاد</option>
                <option value="هنرستان دخترانه رکاد">هنرستان دخترانه رکاد</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">پایه تحصیلی</label>
              <select {...formik.getFieldProps("grade")} className={`bg-white ${inputClass(formik.touched.grade && formik.errors.grade)}`}>
                <option value="">انتخاب کنید</option>
                <option value="دهم">دهم</option>
                <option value="یازدهم">یازدهم</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">رشته تحصیلی</label>
              <select {...formik.getFieldProps("major")} className={`bg-white ${inputClass(formik.touched.major && formik.errors.major)}`}>
                <option value="">انتخاب کنید</option>
                <option value="تولید و توسعه پایگاه‌های اینترنتی (برنامه نویسی و طراحی سایت)">تولید و توسعه پایگاه‌های اینترنتی (برنامه نویسی و طراحی سایت)</option>
                <option value="تولید محتوای چندرسانه‌ای (طراحی گرافیک و تولید محتوای ویدئویی و صوتی)">تولید محتوای چندرسانه‌ای (طراحی گرافیک و تولید محتوای ویدئویی و صوتی)</option>
              </select>
            </div>
          </div>

          {/* Submission button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-white px-8 py-3 rounded-lg font-medium transition-colors active:scale-95 ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#1b234d] hover:bg-blue-900"
              }`}
            >
              {isSubmitting ? "در حال ذخیره..." : "ویرایش اطلاعات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}