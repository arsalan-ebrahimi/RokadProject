// ==========================================
// Page Component: CreateBlog
// Form for creating and publishing a new blog post using unified BlogForm
// ==========================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import BlogForm from "../components/BlogForm";

export default function CreateBlog() {
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
          throw new Error(uploadData?.message || "خطایی در آپلود تصویر رخ داد");
        }
        uploadedFilename = uploadData.data;
      }

      const blogPayload = {
        title: values.title,
        slug: values.slug ? values.slug.trim() : undefined,
        date: (values.date || "").replace(/\//g, "-"),
        description: values.description,
        img: uploadedFilename,
        tags: values.tags || [],
        tableOfContents: (values.tableOfContents || []).filter(
          (item) => item?.title && item.title.trim()
        ),
        htmlContent: values.htmlContent || "",
      };

      const response = await axiosInstance.post("blog", blogPayload);

      if (response && response.success !== false) {
        Notify("success", "مقاله با موفقیت ایجاد و منتشر شد.");
        navigate("/blog");
      } else {
        throw new Error(response?.message || "ثبت مقاله با خطا مواجه شد");
      }
    } catch (error) {
      Notify("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BlogForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isEdit={false}
      pageTitle="افزودن بلاگ جدید"
      pageSubtitle="نگارش مقاله و انتشار در بخش مقالات و وبلاگ"
    />
  );
}