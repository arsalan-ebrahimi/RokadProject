// ==========================================
// Page Component: UpdateBlog
// Form for editing existing blog posts using unified BlogForm
// ==========================================

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import Loading from "../../../Components/Loading";
import BlogForm from "../components/BlogForm";

export default function UpdateBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const [initialValues, setInitialValues] = useState({
    title: "",
    slug: "",
    date: "",
    description: "",
    img: null,
    tags: [],
    tableOfContents: [],
    htmlContent: "",
  });

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const targetId = id ? decodeURIComponent(id) : "";
        const response = await axiosInstance.get(`blog/${targetId}`);
        const data = response?.data?.data || response?.data || response;
        const blog = Array.isArray(data) ? data[0] : data;

        if (blog) {
          setInitialValues({
            title: blog.title || "",
            slug: blog.slug || "",
            date: blog.date || "",
            description: blog.description || "",
            img: blog.img || null,
            tags: Array.isArray(blog.tags) ? blog.tags : [],
            tableOfContents: Array.isArray(blog.tableOfContents)
              ? blog.tableOfContents.map((item) =>
                  typeof item === "string"
                    ? { title: item }
                    : { title: item?.title || "" }
                )
              : [],
            htmlContent: blog.htmlContent || "",
          });

          if (blog.img) {
            setExistingImageUrl(getImageUrl(blog.img));
          }
        } else {
          Notify("error", "اطلاعات مقاله یافت نشد");
        }
      } catch (error) {
        Notify("error", error.message || "خطا در دریافت اطلاعات مقاله");
      }
      setLoading(false);
    };

    if (id) fetchBlog();
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
          throw new Error(uploadData?.message || "خطایی در آپلود تصویر رخ داد");
        }
        finalImageName = uploadData.data;
      }

      const blogPayload = {
        title: values.title,
        slug: values.slug ? values.slug.trim() : undefined,
        date: (values.date || "").replace(/\//g, "-"),
        description: values.description,
        img: finalImageName,
        tags: values.tags || [],
        tableOfContents: (values.tableOfContents || []).filter(
          (item) => item?.title && item.title.trim()
        ),
        htmlContent: values.htmlContent || "",
      };

      const targetId = id ? decodeURIComponent(id) : "";
      const response = await axiosInstance.patch(`blog/${targetId}`, blogPayload);

      if (response && (response.success || response.status === "success")) {
        Notify("success", "مقاله با موفقیت ویرایش شد.");
        navigate("/blog");
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
    <BlogForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isEdit={true}
      existingImageUrl={existingImageUrl}
      pageTitle="ویرایش مقاله"
      pageSubtitle="ویرایش محتوا، مشخصات مقاله و کدهای HTML"
    />
  );
}