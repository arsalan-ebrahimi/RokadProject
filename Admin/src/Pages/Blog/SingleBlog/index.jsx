// ==========================================
// Page Component: SingleBlog
// Live preview page for an existing published blog post
// ==========================================

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import Loading from "../../../Components/Loading";
import { PageHeader, Button } from "../../../Components/UI";
import EditIcon from "@mui/icons-material/Edit";
import BlogPreview from "../components/BlogPreview";

export default function SingleBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const targetId = id ? decodeURIComponent(id) : "";
        const response = await axiosInstance.get(`blog/${targetId}`);
        const data = response?.data?.data || response?.data || response;
        const result = Array.isArray(data) ? data[0] : data;
        if (result) {
          setBlog(result);
        } else {
          Notify("error", "مقاله یافت نشد");
        }
      } catch (error) {
        Notify("error", error.message || "خطا در دریافت اطلاعات مقاله");
      }
      setLoading(false);
    };

    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-[70vh]">
        <Loading size={12} />
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div dir="rtl" className="p-4 sm:p-6 md:p-8 w-full bg-background min-h-dvh">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title={blog.title}
          subtitle={
            blog.slug
              ? `آدرس صفحه: /blog/${blog.slug}`
              : "پیش‌نمایش زنده صفحه مقاله (همانند دید کاربر کلاینت)"
          }
          backTo="/blog"
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/blog/update/${blog.slug || blog._id}`)}
              icon={<EditIcon fontSize="small" />}
            >
              ویرایش مقاله
            </Button>
          }
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <BlogPreview
          title={blog.title}
          date={blog.date}
          description={blog.description}
          img={blog.img}
          tags={blog.tags}
          tableOfContents={blog.tableOfContents}
          htmlContent={blog.htmlContent}
        />
      </div>
    </div>
  );
}