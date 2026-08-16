// ==========================================
// Dependencies & Libraries
// ==========================================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

// ==========================================
// Icons
// ==========================================
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// ==========================================
// Store Actions & Utilities
// ==========================================
import { login } from "../../Store/Slices/authSlice"; 
import fetchData from "../../Utils/fetchData";
import Loading from "../../Components/Loading"; 
import Notify from "../../Utils/notify";

// ==========================================
// Component: AdminLogin
// Description: Handles admin authentication logic
// ==========================================
export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // ----------------------------------------
  // Formik Configuration
  // ----------------------------------------
  const formik = useFormik({
    initialValues: { phoneNumber: "", password: "" },
    
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .matches(/^09\d{9}$/, "شماره همراه معتبر نیست")
        .required("شماره همراه الزامی است"),
      password: Yup.string()
        .required("رمز عبور الزامی است")
        .min(6, "رمز عبور بسیار کوتاه است"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formattedPhone = values.phoneNumber.replace(/^0/, "+98");

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

        if (response && response.success) {
          const userRole = response.data?.user?.role;

          if (userRole === "admin" || userRole === "superAdmin") {
            dispatch(login(response.data.token));
            Notify("success", `خوش آمدید ${response.data.user?.fullName || "مدیر"}`);
            navigate("/"); 
          } else {
            Notify("error", "شما اجازه دسترسی به پنل مدیریت را ندارید.");
          }
        } else {
          Notify("error", response?.message || "اطلاعات ورود نامعتبر است");
        }
      } catch (error) {
        console.error("Authentication Error:", error);
        Notify("error", "خطا در برقراری ارتباط با سرور. لطفاً وضعیت شبکه را بررسی کنید.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ----------------------------------------
  // Render Component
  // ----------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8] p-4" dir="rtl">
      {/* Slightly refined card shadow and border */}
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-8 md:p-10">
        
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/Logo-Type-green.png"
            alt="Rokad Admin Panel"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Header Texts */}
        <h2 className="text-2xl font-bold text-center text-[#1b234d] mb-2">
          ورود به پنل مدیریت
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          لطفاً شماره همراه و رمز عبور خود را وارد کنید
        </p>

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          
          {/* Phone Number Input Group */}
          <div className="flex flex-col relative">
            <input
              type="text"
              name="phoneNumber"
              placeholder="شماره همراه (مثلاً 0912...)"
              dir="ltr"
              className={`w-full px-5 py-4 rounded-2xl bg-gray-50/50 outline-none transition-all text-left font-sans border focus:bg-white ${
                formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? "border-red-400 focus:ring-4 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-[#51b5a5] focus:ring-4 focus:ring-[#51b5a5]/10"
              }`}
              {...formik.getFieldProps("phoneNumber")}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 text-xs mt-2 pr-2 font-medium">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>

          {/* Password Input Group */}
          <div className="flex flex-col relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="رمز عبور"
              dir="ltr"
              className={`w-full pl-5 pr-12 py-4 rounded-2xl bg-gray-50/50 outline-none transition-all text-left font-sans tracking-widest border focus:bg-white ${
                formik.touched.password && formik.errors.password
                  ? "border-red-400 focus:ring-4 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-[#51b5a5] focus:ring-4 focus:ring-[#51b5a5]/10"
              }`}
              {...formik.getFieldProps("password")}
            />
            
            {/* Minimal eye icon for password visibility */}
            <div className="absolute right-4 top-[18px]">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-[#51b5a5] transition-colors focus:outline-none"
                tabIndex="-1"
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </button>
            </div>

            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-xs mt-2 pr-2 font-medium">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              disabled={formik.isSubmitting}
              type="submit"
              className={`w-full h-[55px] font-bold py-3 rounded-2xl transition-all duration-300 flex justify-center items-center text-lg ${
                formik.isSubmitting 
                  ? "bg-[#9cdcd1] cursor-not-allowed" 
                  : "bg-[#51b5a5] hover:bg-[#439a8c] text-white shadow-lg shadow-[#51b5a5]/20 hover:-translate-y-1 hover:shadow-[#51b5a5]/30"
              }`}
            >
              {formik.isSubmitting ? <Loading color="#ffffff" size={8} /> : "ورود به داشبورد"}
            </button>
          </div>
        </form>

        {/* Footer Support Text */}
        <div className="mt-8 text-center pt-6 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            در صورت فراموشی رمز عبور با پشتیبانی فنی تماس بگیرید.
          </p>
        </div>
      </div>
    </div>
  );
}