// ==========================================
// Page Component: UpdateStudent
// Form for editing existing student records using unified StudentForm
// ==========================================

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import Loading from "../../../Components/Loading";
import StudentForm from "../components/StudentForm";
import { toEnglishDigits } from "../../../Utils/toEnglishDigits";

export default function UpdateStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const [initialValues, setInitialValues] = useState({
    fullName: "",
    job: "",
    generation: "",
    schoolType: "",
    major: "",
    img: null,
    currentCity: "",
    graduationYear: "",
    portfolioCount: 0,
    about: "",
    rokadStory: "",
    achievements: "",
    keyActivities: [],
    socialLinks: [],
  });

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`student/${id}`);
        const data = response?.data?.data || response?.data || response;
        const student = Array.isArray(data) ? data[0] : data;

        if (student) {
          setInitialValues({
            fullName: student.fullName || "",
            job: student.job || "",
            generation: student.generation || "",
            schoolType: student.schoolType || "",
            major: student.major || "",
            img: student.img || null,
            currentCity: student.currentCity || "",
            graduationYear: student.graduationYear || "",
            portfolioCount: student.portfolioCount || 0,
            about: student.about || "",
            rokadStory: student.rokadStory || "",
            achievements: student.achievements || "",
            keyActivities: Array.isArray(student.keyActivities)
              ? student.keyActivities
              : [],
            socialLinks: Array.isArray(student.socialLinks)
              ? student.socialLinks
              : [],
          });

          if (student.img) {
            setExistingImageUrl(getImageUrl(student.img));
          }
        } else {
          Notify("error", "اطلاعات دانش‌آموز یافت نشد");
        }
      } catch (error) {
        Notify("error", error.message || "خطا در دریافت اطلاعات دانش‌آموز");
      }
      setLoading(false);
    };

    if (id) fetchStudent();
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
        fullName: values.fullName,
        job: values.job,
        generation: Number(toEnglishDigits(String(values.generation))),
        schoolType: values.schoolType,
        major: values.major,
        img: finalImageName,
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

      const response = await axiosInstance.patch(`student/${id}`, payload);

      if (response && (response.success || response.status === "success")) {
        Notify("success", "اطلاعات دانش‌آموز با موفقیت ویرایش شد.");
        navigate("/student");
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
    <StudentForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isEdit={true}
      existingImageUrl={existingImageUrl}
      pageTitle="ویرایش پرونده دانش‌آموز"
      pageSubtitle="ویرایش شناسنامه، اطلاعات شغلی، دستاوردها و فعالیت‌های کلیدی"
    />
  );
}