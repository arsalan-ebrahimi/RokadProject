// ==========================================
// Page Component: CreateEvent
// Form for publishing events using unified EventForm
// ==========================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import EventForm from "../components/EventForm";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      let uploadedFilename = values.img;

      if (values.img instanceof File) {
        const formData = new FormData();
        formData.append("file", values.img);

        const uploadData = await axiosInstance.post("upload", formData);
        if (!uploadData || !uploadData.success) {
          throw new Error(uploadData?.message || "آپلود تصویر با خطا مواجه شد");
        }
        uploadedFilename = uploadData.data;
      }

      const payload = {
        title: values.title,
        slug: values.slug ? values.slug.trim() : undefined,
        type: values.type,
        date: (values.date || "").replace(/\//g, "-"),
        description: values.description,
        branch: values.branch,
        img: uploadedFilename,
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

      const response = await axiosInstance.post("event", payload);

      if (response && response.success !== false) {
        Notify("success", "رویداد با موفقیت ایجاد شد.");
        navigate("/event");
      } else {
        throw new Error(response?.message || "ثبت رویداد با خطا مواجه شد");
      }
    } catch (error) {
      Notify("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EventForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isEdit={false}
      pageTitle="افزودن رویداد جدید"
      pageSubtitle="ثبت مشخصات و جزئیات رویدادهای آموزشی، فرهنگی و ورزشی"
    />
  );
}