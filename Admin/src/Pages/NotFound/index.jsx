import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 404 Not Found Page Component
 * Styled to match the soft, minimal, and modern theme of the application
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8] p-4" dir="rtl">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-sm ring-1 ring-black/5 p-8 md:p-14 text-center flex flex-col items-center">
        
        {/* Brand Logo - Optional but keeps the user connected to the brand */}
        <div className="flex justify-center mb-8">
          <img 
            src="/Logo-Type-green.png" 
            alt="لوگو رکاد" 
            className="h-12 w-auto object-contain opacity-80" 
          />
        </div>
        
        {/* Large 404 Text */}
        <h1 className="text-8xl md:text-9xl font-black text-[#51b5a5] drop-shadow-sm mb-4 tracking-widest">
          404
        </h1>
        
        {/* Main Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          صفحه مورد نظر پیدا نشد!
        </h2>
        
        {/* Description Paragraph */}
        <p className="text-gray-500 text-sm md:text-base leading-8 mb-10">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد، ممکن است آدرس را اشتباه وارد کرده باشید یا صفحه حذف شده باشد.
        </p>
        
        {/* Back to Home Button */}
        <button 
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-10 h-[55px] bg-[#51b5a5] hover:bg-[#439a8c] text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-[#51b5a5]/30 hover:shadow-xl hover:-translate-y-1 flex justify-center items-center text-lg"
        >
          بازگشت به صفحه اصلی
        </button>

      </div>
    </div>
  );
}