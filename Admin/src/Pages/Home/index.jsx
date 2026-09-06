// ==========================================
// Page Component: Home (Dashboard Overview)
// Landing hub featuring quick-access cards to all management modules, SEO shortcuts, and logout
// ==========================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../Store/Slices/authSlice";
import ArticleIcon from "@mui/icons-material/Article";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CommentIcon from "@mui/icons-material/Comment";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "../../Components/UI";

/**
 * Main dashboard landing page component.
 */
export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  const menuItems = [
    {
      id: 1,
      title: "مدیریت بلاگ",
      subtitle: "Blog Management",
      path: "/blog",
      icon: <ArticleIcon style={{ fontSize: "var(--font-size-icon-lg)" }} />,
      bgClass: "bg-gradient-to-br from-blue-500 to-indigo-600",
      shadowClass: "shadow-indigo-500/20",
    },
    {
      id: 2,
      title: "مدیریت رویدادها",
      subtitle: "Events Management",
      path: "/event",
      icon: <EventIcon style={{ fontSize: "var(--font-size-icon-lg)" }} />,
      bgClass: "bg-gradient-to-br from-emerald-500 to-teal-600",
      shadowClass: "shadow-teal-500/20",
    },
    {
      id: 3,
      title: "مدیریت دانش‌آموزان",
      subtitle: "Students Management",
      path: "/student",
      icon: <PeopleIcon style={{ fontSize: "var(--font-size-icon-lg)" }} />,
      bgClass: "bg-gradient-to-br from-rose-500 to-pink-600",
      shadowClass: "shadow-pink-500/20",
    },
    {
      id: 4,
      title: "مدیریت جوایز و افتخارات",
      subtitle: "Awards & Honors",
      path: "/award",
      icon: <EmojiEventsIcon style={{ fontSize: "var(--font-size-icon-lg)" }} />,
      bgClass: "bg-gradient-to-br from-violet-500 to-purple-600",
      shadowClass: "shadow-purple-500/20",
    },
    {
      id: 5,
      title: "مدیریت نظرات",
      subtitle: "Comments Management",
      path: "/comment",
      icon: <CommentIcon style={{ fontSize: "var(--font-size-icon-lg)" }} />,
      bgClass: "bg-gradient-to-br from-amber-500 to-orange-600",
      shadowClass: "shadow-orange-500/20",
    },
  ];

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-center min-h-[88vh] p-6 md:p-8 bg-background relative"
    >
      {/* Top Action Buttons */}
      <div className="w-full flex justify-between md:justify-end items-center gap-3 mb-6 md:mb-0 md:absolute md:top-8 md:left-8">
        <Button
          variant="primary-subtle"
          size="sm"
          onClick={() => navigate("/seo")}
          icon={<SettingsIcon fontSize="small" />}
        >
          تنظیمات سئو
        </Button>

        <Button
          variant="danger-outline"
          size="sm"
          onClick={handleLogout}
          icon={<LogoutIcon fontSize="small" className="rotate-180" />}
        >
          خروج از حساب
        </Button>
      </div>

      {/* Header Section */}
      <div className="text-center mb-10 md:mb-12 space-y-2 mt-4">
        <h1 className="text-3xl md:text-4xl font-black text-secondary tracking-tight">
          به داشبورد مدیریت خوش آمدید
        </h1>
        <p className="text-text-secondary text-sm md:text-base max-w-lg">
          جهت مدیریت بخش‌های مختلف سایت، گزینه مورد نظر را انتخاب نمایید
        </p>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate(item.path)}
            className={`
              ${item.bgClass}
              text-white
              rounded-2xl
              p-7
              flex items-center gap-5
              transition-all duration-300 ease-out
              transform hover:-translate-y-1.5 hover:scale-[1.01]
              shadow-md hover:shadow-xl
              ${item.shadowClass}
              group cursor-pointer select-none text-right
            `}
          >
            {/* Icon Container with backdrop blur */}
            <div className="bg-white/20 p-3.5 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors shrink-0 flex items-center justify-center">
              {item.icon}
            </div>

            {/* Text details */}
            <div className="flex flex-col items-start flex-grow">
              <span className="text-lg md:text-xl font-bold">{item.title}</span>
              <span className="text-white/80 text-xs font-medium mt-0.5">
                {item.subtitle}
              </span>
            </div>

            {/* Arrow icon */}
            <div className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 duration-300 shrink-0">
              <ArrowBackIcon fontSize="medium" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}