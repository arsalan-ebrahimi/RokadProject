// ==========================================
// Page Component: UpdateBlog
// Form for editing existing blog posts, fetching current data, and updating featured images
// ==========================================

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import Loading from "../../../Components/Loading";
import { Button, Input, Textarea, PageHeader, Card, ImageUpload } from "../../../Components/UI";

// Regular expression to restrict input to safe alphanumeric characters and standard Persian/Latin punctuation
const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/;

/**
 * Yup validation schema for updating an existing blog post.
 */
const blogUpdateSchema = Yup.object({
  title: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("وارد کردن عنوان بلاگ الزامی است"),
  date: Yup.string()
    .matches(safeTextRegex, "مقدار غیرمجاز")
    .required("انتخاب تاریخ انتشار الزامی است"),
  description: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .required("وارد کردن توضیحات الزامی است"),
});

/**
 * UpdateBlog page component for editing blog details.
 */
export default function UpdateBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    title: "",
    date: "",
    description: "",
    img: null,
  });

  useEffect(() => {
    const getBlogData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`blog/${id}`);

        let data = null;
        if (response && response.data) {
          data = Array.isArray(response.data) ? response.data[0] : response.data;
        } else if (Array.isArray(response)) {
          data = response[0];
        }

        if (data) {
          setInitialValues({
            title: data.title || "",
            date: data.date || "",
            description: data.description || "",
            img: data.img || null,
          });

          if (data.img) setImagePreview(getImageUrl(data.img));
        }
      } catch (error) {
        Notify("error", error.message || "خطا در دریافت اطلاعات بلاگ");
      }
      setLoading(false);
    };

    if (id) getBlogData();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: blogUpdateSchema,
    onSubmit: async (values) => {
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

        const blogPayload = {
          title: values.title,
          date: values.date,
          description: values.description,
          img: finalImageName,
        };

        const response = await axiosInstance.patch(`blog/${id}`, blogPayload);

        if (response && (response.success || response.status === "success")) {
          Notify("success", "بلاگ با موفقیت ویرایش شد.");
          navigate("/blog");
        } else {
          throw new Error(response?.message || "ویرایش با خطا مواجه شد");
        }
      } catch (error) {
        Notify("error", error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageSelect = (file) => {
    formik.setFieldValue("img", file);
    setImagePreview(URL.createObjectURL(file));
  };

  if (loading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-[70vh]">
        <Loading size={12} />
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="ویرایش بلاگ"
        subtitle="ویرایش محتوا، تاریخ انتشار و تصویر شاخص"
        backTo="/blog"
      />

      <Card className="p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="عنوان بلاگ"
              error={formik.touched.title && formik.errors.title}
              {...formik.getFieldProps("title")}
            />

            <Input
              label="تاریخ انتشار"
              error={formik.touched.date && formik.errors.date}
              {...formik.getFieldProps("date")}
            />
          </div>

          <Textarea
            label="توضیحات و متن مقاله"
            rows={5}
            error={formik.touched.description && formik.errors.description}
            {...formik.getFieldProps("description")}
          />

          <div className="border-t border-border/80 pt-5">
            <ImageUpload
              label="تغییر تصویر شاخص"
              imagePreview={imagePreview}
              onChange={handleImageSelect}
              error={formik.touched.img && formik.errors.img}
              placeholder="برای تغییر تصویر شاخص کلیک کنید"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border/80">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
            >
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}