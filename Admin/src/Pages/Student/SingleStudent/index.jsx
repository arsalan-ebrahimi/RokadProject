// ==========================================
// Page Component: SingleStudent
// Dedicated dossier / single student profile page displaying the official Identity Card (شناسنامه دانش‌آموز),
// long biography, Rokad journey story, achievements, key activities, and portfolio links
// ==========================================

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import Loading from "../../../Components/Loading";
import { PageHeader, Card, Button, Badge } from "../../../Components/UI";

import BadgeIcon from "@mui/icons-material/Badge";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SchoolIcon from "@mui/icons-material/School";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export default function SingleStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`student/${id}`);
        const data = response?.data?.data || response?.data || response;
        const result = Array.isArray(data) ? data[0] : data;
        if (result) {
          setStudent(result);
        } else {
          Notify("error", "پرونده دانش‌آموز یافت نشد");
        }
      } catch (error) {
        Notify("error", error.message || "خطا در دریافت پرونده دانش‌آموز");
      }
      setLoading(false);
    };

    if (id) fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-[70vh]">
        <Loading size={12} />
      </div>
    );
  }

  if (!student) return null;

  const imageUrl = getImageUrl(student.img);

  return (
    <div dir="rtl" className="p-4 sm:p-6 md:p-8 w-full bg-background min-h-dvh">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto mb-6">
        <PageHeader
          title={student.fullName}
          subtitle={`پرونده تحصیلی، شغلی و شناسنامه دانش‌آموزی (نسل ${student.generation})`}
          backTo="/student"
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/student/update/${student._id}`)}
              icon={<EditIcon fontSize="small" />}
              className="w-full sm:w-auto"
            >
              ویرایش پرونده
            </Button>
          }
        />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-6 md:gap-8">
        {/* Profile Summary Card */}
        <Card className="p-4 sm:p-6 md:p-8 border border-border shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">

            {/* Avatar */}
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-bg-light border-2 border-border/80 shrink-0 shadow-sm flex items-center justify-center relative">
              {student.img ? (
                <img
                  src={imageUrl}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.nextSibling) {
                      e.currentTarget.nextSibling.style.display = "flex";
                    }
                  }}
                />
              ) : null}
              <div
                className="w-full h-full flex items-center justify-center text-text-muted bg-bg-light"
                style={{ display: student.img ? "none" : "flex" }}
              >
                <PersonOutlineIcon className="text-text-muted text-5xl" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center sm:items-start gap-2.5 flex-1 text-center sm:text-right">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <Badge variant="indigo" size="sm">
                  نسل {student.generation}
                </Badge>
                <Badge variant="primary" size="sm">
                  {student.schoolType}
                </Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-secondary">
                {student.fullName}
              </h1>

              <span className="text-sm md:text-base font-semibold text-primary">
                {student.job}
              </span>

              <span className="text-xs md:text-sm text-text-muted">
                {student.major}
              </span>

              {/* Social Links */}
              {Array.isArray(student.socialLinks) && student.socialLinks.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {student.socialLinks.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-info-text bg-info-light border border-info-border px-3 py-1 rounded-lg hover:bg-info-border/30 transition-colors"
                    >
                      <LinkIcon fontSize="inherit" />
                      <span>{s.type}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Official Identity Card (شناسنامه دانش‌آموز) */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-surface to-teal-50/20 border-2 border-primary-border shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-primary-border/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
                <BadgeIcon fontSize="small" />
              </div>
              <h2 className="text-lg font-bold text-secondary">
                شناسنامه دانش‌آموز
              </h2>
            </div>
            <span className="text-xs text-text-muted font-numeric">
              کد سیستمی: {String(student._id || "").slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* 1. Job Status */}
            <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
              <WorkOutlineIcon className="text-primary mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs text-text-muted font-medium">
                  وضعیت شغلی فعلی
                </span>
                <span className="text-sm font-bold text-secondary mt-0.5">
                  {student.job || "ثبت نشده"}
                </span>
              </div>
            </div>

            {/* 2. Generation */}
            <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
              <SchoolIcon className="text-primary mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs text-text-muted font-medium">نسل</span>
                <span className="text-sm font-bold text-secondary mt-0.5 font-numeric">
                  نسل {student.generation}
                </span>
              </div>
            </div>

            {/* 3. Major */}
            <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
              <HistoryEduIcon className="text-primary mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs text-text-muted font-medium">
                  رشته تحصیلی
                </span>
                <span className="text-sm font-bold text-secondary mt-0.5">
                  {student.major || "ثبت نشده"}
                </span>
              </div>
            </div>

            {/* 4. Current City */}
            <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
              <LocationCityIcon className="text-primary mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs text-text-muted font-medium">
                  شهر فعالیت کنونی
                </span>
                <span className="text-sm font-bold text-secondary mt-0.5">
                  {student.currentCity || "ثبت نشده"}
                </span>
              </div>
            </div>

            {/* 5. Graduation Year */}
            <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
              <SchoolIcon className="text-primary mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs text-text-muted font-medium">
                  سال فارغ‌التحصیلی
                </span>
                <span className="text-sm font-bold text-secondary mt-0.5 font-numeric">
                  {student.graduationYear || "ثبت نشده"}
                </span>
              </div>
            </div>

            {/* 6. Portfolio Count */}
            <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
              <CollectionsBookmarkIcon className="text-primary mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs text-text-muted font-medium">
                  تعداد نمونه‌کارها
                </span>
                <span className="text-sm font-bold text-secondary mt-0.5 font-numeric">
                  {student.portfolioCount || 0} پروژه
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* About Student (درباره دانش‌آموز) */}
        {student.about && (
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border">
              <AutoStoriesIcon className="text-primary" />
              <h2 className="text-lg font-bold text-secondary">
                درباره دانش‌آموز
              </h2>
            </div>
            <p className="text-sm md:text-base text-text-secondary leading-loose whitespace-pre-line">
              {student.about}
            </p>
          </Card>
        )}

        {/* Story with Rokad (روایتی که از رکاد داشته) */}
        {student.rokadStory && (
          <Card className="p-6 md:p-8 bg-teal-50/30 border border-teal-200/70">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-teal-200/50">
              <HistoryEduIcon className="text-primary" />
              <h2 className="text-lg font-bold text-secondary">
                روایتی که از رکاد داشته
              </h2>
            </div>
            <p className="text-sm md:text-base text-text-secondary leading-loose whitespace-pre-line">
              {student.rokadStory}
            </p>
          </Card>
        )}

        {/* Achievements and Honors (دستاوردها و افتخارات) */}
        {student.achievements && (
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border">
              <EmojiEventsIcon className="text-amber-500" />
              <h2 className="text-lg font-bold text-secondary">
                دستاوردها و افتخارات
              </h2>
            </div>
            <p className="text-sm md:text-base text-text-secondary leading-loose whitespace-pre-line">
              {student.achievements}
            </p>
          </Card>
        )}

        {/* Key Activities (فعالیت‌های کلیدی در دوران دانش‌آموزی) */}
        {Array.isArray(student.keyActivities) && student.keyActivities.length > 0 && (
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border">
              <LocalActivityIcon className="text-primary" />
              <h2 className="text-lg font-bold text-secondary">
                فعالیت‌های کلیدی در دوران دانش‌آموزی
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.keyActivities.map((act, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-bg-light/60 border border-border flex flex-col gap-2 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <h3 className="text-sm font-bold text-secondary">
                      {act.title}
                    </h3>
                  </div>
                  {act.description && (
                    <p className="text-xs md:text-sm text-text-secondary leading-relaxed pr-4">
                      {act.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
