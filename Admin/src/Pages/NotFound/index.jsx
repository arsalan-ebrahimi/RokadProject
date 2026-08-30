import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Button } from "../../Components/UI";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light p-4" dir="rtl">
      <div className="max-w-lg w-full bg-surface rounded-2xl shadow-lg border border-border/80 p-8 md:p-12 text-center flex flex-col items-center">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/Logo-Type-green.png"
            alt="لوگو رکاد"
            className="h-10 w-auto object-contain opacity-80"
          />
        </div>

        {/* Large 404 Text */}
        <h1 className="text-7xl md:text-8xl font-black text-primary mb-3 tracking-wider">
          404
        </h1>

        {/* Main Heading */}
        <h2 className="text-xl md:text-2xl font-bold text-secondary mb-2">
          صفحه مورد نظر پیدا نشد!
        </h2>

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-sm">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
        </p>

        {/* Back to Home Button */}
        <Button
          variant="primary"
          size="tall"
          onClick={() => navigate("/")}
          icon={<ArrowForwardIcon fontSize="small" />}
          className="px-8 shadow-md hover:shadow-lg shadow-primary/20"
        >
          بازگشت به داشبورد
        </Button>
      </div>
    </div>
  );
}