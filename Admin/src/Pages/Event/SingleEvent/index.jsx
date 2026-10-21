// ==========================================
// Page Component: SingleEvent
// Dedicated single event view showcasing organizers, teams, deadlines, and quotes
// ==========================================

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import Loading from "../../../Components/Loading";
import { PageHeader, Card, Button, Badge } from "../../../Components/UI";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import EditIcon from "@mui/icons-material/Edit";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonIcon from "@mui/icons-material/Person";

export default function SingleEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const targetId = id ? decodeURIComponent(id) : "";
        const response = await axiosInstance.get(`event/${targetId}`);
        const data = response?.data?.data || response?.data || response;
        const result = Array.isArray(data) ? data[0] : data;
        if (result) {
          setEvent(result);
        } else {
          Notify("error", "رویداد یافت نشد");
        }
      } catch (error) {
        Notify("error", error.message || "خطا در دریافت اطلاعات رویداد");
      }
      setLoading(false);
    };

    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-[70vh]">
        <Loading size={12} />
      </div>
    );
  }

  if (!event) return null;

  const imageUrl = getImageUrl(event.img);

  // Group organizers by category
  const mentors = (event.organizers || []).filter((o) => o.category === "منتور");
  const judges = (event.organizers || []).filter((o) => o.category === "داور");
  const staff = (event.organizers || []).filter((o) => o.category === "عوامل اجرایی");

  return (
    <div dir="rtl" className="p-4 sm:p-6 md:p-8 w-full bg-background min-h-dvh">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title={event.title}
          subtitle={event.slug ? `آدرس صفحه: /event/${event.slug}` : `مشخصات کامل و جزئیات برگزاری ${event.type}`}
          backTo="/event"
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/event/update/${event.slug || event._id}`)}
              icon={<EditIcon fontSize="small" />}
              className="w-full sm:w-auto"
            >
              ویرایش اطلاعات رویداد
            </Button>
          }
        />
      </div>


      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Hero Banner Card */}
        <Card className="overflow-hidden p-0 border border-border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Poster image */}
            <div className="md:col-span-5 h-64 md:h-auto bg-bg-light relative border-b md:border-b-0 md:border-l border-border">
              {event.img ? (
                <img
                  src={imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                  بدون تصویر
                </div>
              )}
            </div>

            {/* Event Key Highlights */}
            <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {event.type}
                  </Badge>
                  {Array.isArray(event.branch) &&
                    event.branch.map((b, idx) => (
                      <Badge
                        key={idx}
                        variant={b === "دخترانه" ? "pink" : "info"}
                        size="sm"
                      >
                        شعبه {b}
                      </Badge>
                    ))}
                </div>

                <h1 className="text-xl md:text-2xl font-black text-secondary leading-snug">
                  {event.title}
                </h1>

                <p className="text-xs md:text-sm text-text-secondary leading-relaxed line-clamp-3">
                  {event.description}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/70 text-xs">
                {event.holdingDate && (
                  <div className="flex items-center gap-2 text-text-primary">
                    <CalendarTodayIcon fontSize="inherit" className="text-primary shrink-0" />
                    <span>برگزاری: <strong>{event.holdingDate}</strong></span>
                  </div>
                )}
                {event.eventDuration && (
                  <div className="flex items-center gap-2 text-text-primary">
                    <AccessTimeIcon fontSize="inherit" className="text-primary shrink-0" />
                    <span>مدت: <strong>{event.eventDuration}</strong></span>
                  </div>
                )}
                {event.closingLocation && (
                  <div className="flex items-center gap-2 text-text-primary col-span-2">
                    <LocationOnIcon fontSize="inherit" className="text-primary shrink-0" />
                    <span>اختتامیه: <strong>{event.closingLocation}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Organizers Section (Mentors, Judges, Staff) */}
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border">
            <GroupIcon className="text-primary" />
            <h2 className="text-lg font-bold text-secondary">
              کادر برگزاری رویداد
            </h2>
            <span className="text-xs text-text-muted font-numeric">
              ({event.organizers?.length || 0} نفر)
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {/* Mentors */}
            {mentors.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-md inline-block mb-3">
                  منتورهای رویداد
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {mentors.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-bg-light/60 rounded-xl border border-border"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                        <PersonIcon fontSize="small" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-secondary truncate">
                          {m.name}
                        </span>
                        <span className="text-xs text-text-muted truncate">
                          {m.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Judges */}
            {judges.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md inline-block mb-3">
                  داوران مسابقات
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {judges.map((j, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-bg-light/60 rounded-xl border border-border"
                    >
                      <div className="w-10 h-10 rounded-full bg-info/15 text-info flex items-center justify-center shrink-0">
                        <PersonIcon fontSize="small" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-secondary truncate">
                          {j.name}
                        </span>
                        <span className="text-xs text-text-muted truncate">
                          {j.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Executive Staff */}
            {staff.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 px-3 py-1 rounded-md inline-block mb-3">
                  عوامل اجرایی و تسهیلگران
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {staff.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-bg-light/60 rounded-xl border border-border"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                        <PersonIcon fontSize="small" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-secondary truncate">
                          {s.name}
                        </span>
                        <span className="text-xs text-text-muted truncate">
                          {s.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Teams Podium & Honored Teams */}
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border">
            <EmojiEventsIcon className="text-amber-500" />
            <h2 className="text-lg font-bold text-secondary">
              تیم‌های برتر و سکوی قهرمانی
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* First Team */}
            <div className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50/50 flex flex-col items-center text-center gap-2">
              <span className="text-2xl">🥇</span>
              <span className="text-xs font-bold text-amber-800">تیم اول مسابقه</span>
              <span className="text-base font-extrabold text-secondary">
                {event.teams?.firstTeam?.name || "مشخص نشده"}
              </span>
              {event.teams?.firstTeam?.isHonored && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full mt-1">
                  <CheckCircleOutlineIcon fontSize="inherit" />
                  شایسته تقدیر
                </span>
              )}
            </div>

            {/* Second Team */}
            <div className="p-4 rounded-xl border-2 border-slate-300 bg-slate-50/60 flex flex-col items-center text-center gap-2">
              <span className="text-2xl">🥈</span>
              <span className="text-xs font-bold text-slate-700">تیم دوم مسابقه</span>
              <span className="text-base font-extrabold text-secondary">
                {event.teams?.secondTeam?.name || "مشخص نشده"}
              </span>
              {event.teams?.secondTeam?.isHonored && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full mt-1">
                  <CheckCircleOutlineIcon fontSize="inherit" />
                  شایسته تقدیر
                </span>
              )}
            </div>

            {/* Third Team */}
            <div className="p-4 rounded-xl border-2 border-amber-700/30 bg-amber-100/30 flex flex-col items-center text-center gap-2">
              <span className="text-2xl">🥉</span>
              <span className="text-xs font-bold text-amber-900">تیم سوم مسابقه</span>
              <span className="text-base font-extrabold text-secondary">
                {event.teams?.thirdTeam?.name || "مشخص نشده"}
              </span>
              {event.teams?.thirdTeam?.isHonored && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full mt-1">
                  <CheckCircleOutlineIcon fontSize="inherit" />
                  شایسته تقدیر
                </span>
              )}
            </div>
          </div>

          {/* Honored Teams List */}
          {Array.isArray(event.teams?.honoredTeams) &&
            event.teams.honoredTeams.length > 0 && (
              <div className="pt-4 border-t border-border">
                <span className="text-xs font-bold text-text-secondary mb-3 block">
                  سایر تیم‌های شایسته تقدیر:
                </span>
                <div className="flex flex-wrap gap-2">
                  {event.teams.honoredTeams.map((ht, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg"
                    >
                      <EmojiEventsIcon fontSize="inherit" className="text-emerald-600" />
                      <span>{ht.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
        </Card>

        {/* How It Went (رویداد چطور گذشت) */}
        {event.howItWent && (
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border">
              <AutoStoriesIcon className="text-primary" />
              <h2 className="text-lg font-bold text-secondary">رویداد چطور گذشت؟</h2>
            </div>
            <p className="text-sm md:text-base text-text-secondary leading-loose whitespace-pre-line">
              {event.howItWent}
            </p>
          </Card>
        )}

        {/* Memorable Quote */}
        {event.memorableQuote?.quote && (
          <Card className="p-6 md:p-8 bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-4">
              <FormatQuoteIcon className="text-primary text-4xl shrink-0 mt-1" />
              <div className="flex flex-col gap-3">
                <p className="text-base md:text-lg font-bold text-secondary leading-relaxed">
                  «{event.memorableQuote.quote}»
                </p>
                {event.memorableQuote.speaker && (
                  <span className="text-xs md:text-sm text-text-accent font-semibold">
                    — {event.memorableQuote.speaker}
                  </span>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Deadlines Section */}
        {((Array.isArray(event.deadlines) && event.deadlines.length > 0) ||
          event.deadlinesDescription) && (
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
              <AccessTimeIcon className="text-primary" />
              <h2 className="text-lg font-bold text-secondary">
                گاه‌شمار و ددلاین‌های رویداد
              </h2>
            </div>

            {event.deadlinesDescription && (
              <p className="text-xs md:text-sm text-text-muted mb-6 leading-relaxed">
                {event.deadlinesDescription}
              </p>
            )}

            <div className="flex flex-col gap-4">
              {event.deadlines?.map((dl, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl bg-bg-light/60 border border-border"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center font-numeric shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-bold text-secondary">
                        {dl.title}
                      </span>
                      {dl.date && (
                        <span className="text-xs text-primary font-numeric font-semibold bg-primary/10 px-2 py-0.5 rounded">
                          {dl.date}
                        </span>
                      )}
                    </div>
                    {dl.description && (
                      <p className="text-xs md:text-sm text-text-secondary leading-relaxed mt-1">
                        {dl.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tags */}
        {Array.isArray(event.tags) && event.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-text-muted">تگ‌ها:</span>
            {event.tags.map((t, idx) => (
              <Badge key={idx} variant="neutral" size="sm">
                #{t}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
