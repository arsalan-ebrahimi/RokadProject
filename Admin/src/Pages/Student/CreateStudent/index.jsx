// ==========================================
// Page Component: CreateStudent
// Form for registering new student profiles using unified StudentForm
// ==========================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import StudentForm, { toEnglishDigits } from "../components/StudentForm";

export default function CreateStudent() {
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
        fullName: values.fullName,
        job: values.job,
        generation: Number(toEnglishDigits(String(values.generation))),
        schoolType: values.schoolType,
        major: values.major,
        img: uploadedFilename,
        currentCity: values.currentCity || "",
        graduationYear: values.graduationYear || "",
        portfolioCount: Number(toEnglishDigits(String(values.portfolioCount || 0))) || 0,
        about: values.about || "",
        rokadStory: values.rokadStory || "",
        achievements: values.achievements || "",
        keyActivities: (values.keyActivities || []).filter(
          (act) => act?.title && act.title.trim()
        ),
        socialLinks: (values.socialLinks || []).filter(
          (s) => s?.type && s?.link
        ),
      };

      const response = await axiosInstance.post("student", payload);

      if (response && response.success !== false) {
        Notify("success", "پرونده دانش‌آموز با موفقیت ثبت شد.");
        navigate("/student");
      } else {
        throw new Error(response?.message || "ثبت پرونده با خطا مواجه شد");
      }
    } catch (error) {
      Notify("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StudentForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isEdit={false}
      pageTitle="افزودن دانش‌آموز جدید"
      pageSubtitle="ثبت مشخصات شناسنامه، رزومه شغلی و پرونده دانش‌آموز"
    />
  );
}