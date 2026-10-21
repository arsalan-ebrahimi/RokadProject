// ==========================================
// Page Component: UpdateEvent
// Form for modifying event details using unified EventForm
// ==========================================

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import Loading from "../../../Components/Loading";
import EventForm from "../components/EventForm";

export default function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const [initialValues, setInitialValues] = useState({
    title: "",
    slug: "",
    type: "",
    date: "",
    description: "",
    branch: [],
    img: null,
    eventDuration: "",
    closingLocation: "",
    holdingDate: "",
    organizers: [],
    teams: {
      firstTeam: { name: "", isHonored: false },
      secondTeam: { name: "", isHonored: false },
      thirdTeam: { name: "", isHonored: false },
      honoredTeams: [],
    },
    howItWent: "",
    memorableQuote: { quote: "", speaker: "" },
    deadlinesDescription: "",
    deadlines: [],
    tags: [],
  });

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const targetId = id ? decodeURIComponent(id) : "";
        const response = await axiosInstance.get(`event/${targetId}`);
        const data = response?.data?.data || response?.data || response;
        const event = Array.isArray(data) ? data[0] : data;

        if (event) {
          setInitialValues({
            title: event.title || "",
            slug: event.slug || "",
            type: event.type || "",
            date: event.date || "",
            description: event.description || "",
            branch: Array.isArray(event.branch)
              ? event.branch
              : event.branch
                ? [event.branch]
                : [],
            img: event.img || null,
            eventDuration: event.eventDuration || "",
            closingLocation: event.closingLocation || "",
            holdingDate: event.holdingDate || "",
            organizers: (() => {
              const orgs = Array.isArray(event.organizers) ? [...event.organizers] : [];
              const defaultCategories = ["منتور", "داور", "عوامل اجرایی"];
              while (orgs.length < 3) {
                orgs.push({
                  name: "",
                  role: "",
                  category: defaultCategories[orgs.length] || "منتور",
                });
              }
              return orgs;
            })(),
            teams: {
              firstTeam: {
                name: event.teams?.firstTeam?.name || "",
                isHonored: Boolean(event.teams?.firstTeam?.isHonored),
              },
              secondTeam: {
                name: event.teams?.secondTeam?.name || "",
                isHonored: Boolean(event.teams?.secondTeam?.isHonored),
              },
              thirdTeam: {
                name: event.teams?.thirdTeam?.name || "",
                isHonored: Boolean(event.teams?.thirdTeam?.isHonored),
              },
              honoredTeams: Array.isArray(event.teams?.honoredTeams)
                ? event.teams.honoredTeams
                : [],
            },
            howItWent: event.howItWent || "",
            memorableQuote: {
              quote: event.memorableQuote?.quote || "",
              speaker: event.memorableQuote?.speaker || "",
            },
            deadlinesDescription: event.deadlinesDescription || "",
            deadlines: Array.isArray(event.deadlines) ? event.deadlines : [],
            tags: Array.isArray(event.tags) ? event.tags : [],
          });

          if (event.img) {
            setExistingImageUrl(getImageUrl(event.img));
          }
        } else {
          Notify("error", "اطلاعات رویداد یافت نشد");
        }
      } catch (error) {
        Notify("error", error.message || "خطا در دریافت اطلاعات رویداد");
      }
      setLoading(false);
    };

    if (id) fetchEvent();
  }, [id]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      let finalImageName = values.img;

      if (values.img instanceof File) {
        const formData = new FormData();
        formData.append("file", values.img);

        const uploadData = await axiosInstance.post("upload", formData);
        if (!uploadData || !uploadData.success) {
          throw new Error(uploadData?.message || "آپلود تصویر با خطا مواجه شد");
        }
        finalImageName = uploadData.data;
      }

      const payload = {
        title: values.title,
        slug: values.slug ? values.slug.trim() : undefined,
        type: values.type,
        date: (values.date || "").replace(/\//g, "-"),
        description: values.description,
        branch: values.branch,
        img: finalImageName,
        eventDuration: values.eventDuration || "",
        closingLocation: values.closingLocation || "",
        holdingDate: values.holdingDate || "",
        organizers: (values.organizers || []).filter(
          (o) => o?.name && o?.role && o?.category
        ),
        teams: {
          firstTeam: {
            name: values.teams?.firstTeam?.name || "",
            isHonored: Boolean(values.teams?.firstTeam?.isHonored),
          },
          secondTeam: {
            name: values.teams?.secondTeam?.name || "",
            isHonored: Boolean(values.teams?.secondTeam?.isHonored),
          },
          thirdTeam: {
            name: values.teams?.thirdTeam?.name || "",
            isHonored: Boolean(values.teams?.thirdTeam?.isHonored),
          },
          honoredTeams: (values.teams?.honoredTeams || []).filter(
            (ht) => ht?.name && ht.name.trim()
          ),
        },
        howItWent: values.howItWent || "",
        memorableQuote: {
          quote: values.memorableQuote?.quote || "",
          speaker: values.memorableQuote?.speaker || "",
        },
        deadlinesDescription: values.deadlinesDescription || "",
        deadlines: (values.deadlines || []).filter(
          (dl) => dl?.title && dl.title.trim()
        ),
        tags: values.tags || [],
      };

      const targetId = id ? decodeURIComponent(id) : "";
      const response = await axiosInstance.patch(`event/${targetId}`, payload);

      if (response && (response.success || response.status === "success")) {
        Notify("success", "رویداد با موفقیت بروزرسانی شد.");
        navigate("/event");
      } else {
        throw new Error(response?.message || "ویرایش با خطا مواجه شد");
      }
    } catch (error) {
      Notify("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-[70vh]">
        <Loading size={12} />
      </div>
    );
  }

  return (
    <EventForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isEdit={true}
      existingImageUrl={existingImageUrl}
      pageTitle="ویرایش اطلاعات رویداد"
      pageSubtitle="ویرایش کادر، تیم‌های برتر، زمان‌بندی و گزارش برگزاری"
    />
  );
}