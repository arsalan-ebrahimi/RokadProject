import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../Context/AuthContext";
import fetchData from "../../Utils/fetchData";
import Loading from "../../Components/Loading";
import Notify from "../../Utils/notify";

/**
 * AdminLogin Component
 * Handles administrative authentication using phone number and password.
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const { handleToken } = useContext(AuthContext);

  /**
   * Formik Configuration
   * Manages form state, validation, and submission logic.
   */
  const formik = useFormik({
    initialValues: { phoneNumber: "", password: "" },
    validationSchema: Yup.object({
      // Validates Iranian mobile number format (starts with 09)
      phoneNumber: Yup.string()
        .matches(/^09\d{9}$/, "شماره همراه معتبر نیست")
        .required("شماره همراه الزامی است"),
      password: Yup.string()
        .required("رمز عبور الزامی است")
        .min(6, "رمز عبور بسیار کوتاه است"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Step 1: Format phone number to international format (+98...) for backend compatibility
        const formattedPhone = values.phoneNumber.replace(/^0/, "+98");

        // Step 2: API Call to authentication endpoint
        const response = await fetchData("auth/login-password", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            phoneNumber: formattedPhone,
            password: values.password,
          }),
        });

        /**
         * Step 3: Handle API Response
         * Checks for success flag and validates user role.
         */
        if (response && response.success) {
          // Access role from data.user based on provided backend structure
          const userRole = response.data?.user?.role;

          // Authorization: Only allow admin or superadmin to enter
          if (userRole === "admin" || userRole === "superAdmin") {
            handleToken(response.data.token);
            Notify("success", `خوش آمدید ${response.data.user?.fullName || "مدیر"}`);
            
            // Redirect to dashboard root (matched with router.js)
            navigate("/"); 
          } else {
            Notify("error", "شما اجازه دسترسی به پنل مدیریت را ندارید.");
          }
        } else {
          // Display backend-specific error message
          Notify("error", response?.message || "اطلاعات ورود نامعتبر است");
        }
      } catch (error) {
        // Log critical errors (like JSON parse issues or network failures)
        console.error("Authentication Error:", error);
        Notify("error", "خطا در برقراری ارتباط با سرور. لطفاً وضعیت شبکه را بررسی کنید.");
      } finally {
        // Re-enable the submit button
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8] p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm ring-1 ring-black/5 p-8 md:p-10">
        
        {/* Branding & Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/Logo-Type-green.png" 
            alt="Rokad Admin Panel" 
            className="h-16 w-auto object-contain" 
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          ورود به پنل مدیریت
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          لطفاً شماره همراه و رمز عبور خود را وارد کنید
        </p>
        
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          
          {/* Phone Number Field */}
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
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 text-xs mt-2 pr-2">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>

          {/* Password Field */}
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
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-xs mt-2 pr-2">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            disabled={formik.isSubmitting}
            type="submit"
            className="w-full h-[55px] bg-[#51b5a5] hover:bg-[#439a8c] text-white font-bold py-3 rounded-2xl transition-all duration-300 disabled:bg-[#9cdcd1] shadow-lg shadow-[#51b5a5]/30 hover:shadow-xl hover:-translate-y-1 flex justify-center items-center text-lg mt-6"
          >
            {formik.isSubmitting ? <Loading /> : "ورود به داشبورد"}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
                در صورت فراموشی رمز عبور با پشتیبانی فنی تماس بگیرید.
            </p>
        </div>
      </div>
    </div>
  );
}