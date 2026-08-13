import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Assuming AuthContext is in the same directory. 
// Please adjust the import path based on your folder structure.
import { AuthContext } from "../../Context/AuthContext"; 

// Importing Material UI Icons for better UX
import ArticleIcon from "@mui/icons-material/Article";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CommentIcon from "@mui/icons-material/Comment";
import LogoutIcon from "@mui/icons-material/Logout"; 

export default function Home() {
  const navigate = useNavigate();
  
  // Accessing AuthContext to handle token state
  const { handleToken } = useContext(AuthContext);

  /**
   * Handler for logging out the user.
   * Clears the token and redirects to the login page.
   */
  const handleLogout = () => {
    // Passing a falsy value (null) clears the token in both context and localStorage
    handleToken(null); 
    // Redirect to the login page (adjust the route path if needed)
    navigate("/login"); 
  };

  /**
   * Dashboard Menu Items Configuration.
   * Uses a softer, modern color palette (Tailwind 400-500 series) for better UI.
   */
  const menuItems = [
    {
      id: 1,
      title: "مدیریت بلاگ",
      subtitle: "(Blog Management)",
      path: "/blog",
      icon: <ArticleIcon style={{ fontSize: 50 }} />,
      bgClass: "bg-gradient-to-br from-blue-400 to-indigo-500", 
      shadowClass: "shadow-indigo-200",
    },
    {
      id: 2,
      title: "مدیریت ثبت‌نام",
      subtitle: "(Enrollment)",
      path: "/enrollment",
      icon: <SchoolIcon style={{ fontSize: 50 }} />,
      bgClass: "bg-gradient-to-br from-emerald-400 to-teal-500", 
      shadowClass: "shadow-teal-200",
    },
    {
      id: 3,
      title: "مدیریت جوایز",
      subtitle: "(Awards)",
      path: "/award",
      icon: <EmojiEventsIcon style={{ fontSize: 50 }} />,
      bgClass: "bg-gradient-to-br from-violet-400 to-purple-500", 
      shadowClass: "shadow-purple-200",
    },
    {
      id: 4,
      title: "مدیریت نظرات",
      subtitle: "(Comments)",
      path: "/comment",
      icon: <CommentIcon style={{ fontSize: 50 }} />,
      bgClass: "bg-gradient-to-br from-amber-400 to-orange-500",
      shadowClass: "shadow-orange-200",
    },
  ];

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-center min-h-[85vh] p-6 bg-gray-50 relative"
    >
      {/* --- Logout Button Section --- */}
      {/* Positioned at the top-left corner for RTL layouts */}
      <div className="absolute top-6 left-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group font-bold"
        >
          <span>خروج از حساب</span>
          <LogoutIcon className="rotate-180 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {/* --- Dashboard Header Section --- */}
      <div className="text-center mb-12 space-y-2 mt-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#1b234d] tracking-tight">
          به داشبورد ادمین خوش آمدید
        </h1>
        <p className="text-gray-500 text-lg">
          جهت مدیریت بخش‌های مختلف سایت، گزینه مورد نظر را انتخاب کنید
        </p>
      </div>

      {/* --- Navigation Grid Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`
              ${item.bgClass} 
              text-white 
              rounded-2xl 
              p-8 
              flex items-center gap-6 
              transition-all duration-300 ease-in-out
              transform hover:-translate-y-2 hover:scale-[1.02]
              shadow-lg hover:shadow-xl
              ${item.shadowClass}
              group
            `}
          >
            {/* Icon Container with slight transparency and blur effect */}
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              {item.icon}
            </div>

            {/* Text Container */}
            <div className="flex flex-col items-start text-right">
              <span className="text-2xl font-bold">{item.title}</span>
              <span className="text-white/80 text-sm font-medium mt-1">
                {item.subtitle}
              </span>
            </div>

            {/* Arrow Decoration (Visual Cue on Hover) */}
            <div className="mr-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-8 h-8 rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}