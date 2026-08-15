// ==========================================
// Dependencies & Libraries
// ==========================================
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

// ==========================================
// Store Actions & Utilities
// ==========================================
import { login } from "../../Store/Slices/authSlice"; 
import fetchData from "../../Utils/fetchData";
import Loading from "../../Components/Loading"; // Custom Loading component
import Notify from "../../Utils/notify";

// ==========================================
// Component: AdminLogin
// Description: Handles admin authentication logic
// ==========================================
export default function AdminLogin() {
  // Navigation and Redux dispatch hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ----------------------------------------
  // Formik Configuration
  // ----------------------------------------
  const formik = useFormik({
    initialValues: { phoneNumber: "", password: "" },
    
    // Validation rules using Yup
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .matches(/^09\d{9}$/, "شماره همراه معتبر نیست")
        .required("شماره همراه الزامی است"),
      password: Yup.string()
        .required("رمز عبور الزامی است")
        .min(6, "رمز عبور بسیار کوتاه است"),
    }),

    // Form submission handler
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Format the phone number to match backend expectations (e.g., +98912...)
        const formattedPhone = values.phoneNumber.replace(/^0/, "+98");

        // Execute API request for login
        const response = await fetchData("auth/login-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: formattedPhone,
            password: values.password,
          }),
        });

        // Process successful API response
        if (response && response.success) {
          const userRole = response.data?.user?.role;

          // Role-based access control (RBAC): restrict access to admins only
          if (userRole === "admin" || userRole === "superAdmin") {
            
            // Dispatch login action to store token in Redux and LocalStorage
            dispatch(login(response.data.token));
            
            // Show success notification
            Notify("success", `خوش آمدید ${response.data.user?.fullName || "مدیر"}`);
            
            // Redirect to dashboard root
            navigate("/"); 
          } else {
            // Reject unauthorized roles
            Notify("error", "شما اجازه دسترسی به پنل مدیریت را ندارید.");
          }
        } else {
          // Display error message from backend
          Notify("error", response?.message || "اطلاعات ورود نامعتبر است");
        }
      } catch (error) {
        // Handle network or unexpected errors
        console.error("Authentication Error:", error);
        Notify("error", "خطا در برقراری ارتباط با سرور. لطفاً وضعیت شبکه را بررسی کنید.");
      } finally {
        // Re-enable form submission button
        setSubmitting(false);
      }
    },
  });

  // ----------------------------------------
  // Render Component
  // ----------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8] p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm ring-1 ring-black/5 p-8 md:p-10">
        
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/Logo-Type-green.png"
            alt="Rokad Admin Panel"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Header Texts */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          ورود به پنل مدیریت
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          لطفاً شماره همراه و رمز عبور خود را وارد کنید
        </p>

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          
          {/* Phone Number Input Group */}
          <div className="flex flex-col">
            <input
              type="text"
              name="phoneNumber"
              placeholder="شماره همراه (مثلاً 0912...)"
              dir="ltr"
              className={`w-full px-5 py-3.5 rounded-2xl border-0 bg-gray-50 outline-none transition-all text-left font-sans ring-1 ${
                formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? "ring-red-400"
                  : "ring-black/5 focus:ring-2 focus:ring-[#51b5a5]/50"
              }`}
              {...formik.getFieldProps("phoneNumber")}
            />
            {/* Phone Error Message */}
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 text-xs mt-2 pr-2">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>

          {/* Password Input Group */}
          <div className="flex flex-col">
            <input
              type="password"
              name="password"
              placeholder="رمز عبور"
              dir="ltr"
              className={`w-full px-5 py-3.5 rounded-2xl border-0 shadow-sm bg-[#fcfcfc] outline-none transition-all text-left font-sans tracking-widest ${
                formik.touched.password && formik.errors.password
                  ? "ring-2 ring-red-400/50 focus:ring-red-400"
                  : "ring-1 ring-black/5 focus:ring-2 focus:ring-[#51b5a5]/50 hover:shadow-md"
              }`}
              {...formik.getFieldProps("password")}
            />
            {/* Password Error Message */}
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-xs mt-2 pr-2">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              disabled={formik.isSubmitting}
              type="submit"
              className={`w-full h-[55px] font-bold py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-[#51b5a5]/30 hover:shadow-xl hover:-translate-y-1 flex justify-center items-center text-lg ${
                formik.isSubmitting 
                  ? "bg-[#9cdcd1] cursor-not-allowed" 
                  : "bg-[#51b5a5] hover:bg-[#439a8c] text-white"
              }`}
            >
              {/* Passed proper color parameter so it stays visible on the green button */}
              {formik.isSubmitting ? <Loading color="#ffffff" size={8} /> : "ورود به داشبورد"}
            </button>
          </div>
        </form>

        {/* Footer Support Text */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            در صورت فراموشی رمز عبور با پشتیبانی فنی تماس بگیرید.
          </p>
        </div>
      </div>
    </div>
  );
}