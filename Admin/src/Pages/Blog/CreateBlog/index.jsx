// ==========================================
// Page Component: CreateBlog
// Form for creating and publishing a new blog post with featured image upload
// ==========================================

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { Button, Input, Textarea, PageHeader, Card, ImageUpload } from "../../../Components/UI";

// Regular expression to restrict input to safe alphanumeric characters and standard Persian/Latin punctuation
const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/;

/**
 * Yup validation schema for creating a blog post.
 */
const blogValidationSchema = Yup.object({
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
  img: Yup.mixed().required("انتخاب تصویر شاخص الزامی است"),
});

/**
 * CreateBlog page component handling blog creation and image upload.
 */
export default function CreateBlog() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      date: "",
      description: "",
      img: null,
    },
    validationSchema: blogValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("file", values.img);

        const uploadData = await axiosInstance.post("upload", formData);

        if (!uploadData || !uploadData.success) {
          throw new Error(uploadData?.message || "آپلود عکس با خطا مواجه شد");
        }

        const uploadedFilename = uploadData.data;

        const blogPayload = {
          title: values.title,
          date: values.date,
          description: values.description,
          img: uploadedFilename,
        };

        const blogData = await axiosInstance.post("blog", blogPayload);

        if (blogData && blogData.success) {
          Notify("success", "بلاگ با موفقیت ثبت شد.");
          window.history.back();
        } else {
          throw new Error(blogData?.message || "ثبت بلاگ با خطا مواجه شد");
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

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="افزودن بلاگ جدید"
        subtitle="نگارش مقاله و انتشار در بخش مقالات و وبلاگ"
        backTo="/blog"
      />

      <Card className="p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="عنوان بلاگ"
              placeholder="مثال: معرفی رشته شبکه و نرم‌افزار"
              error={formik.touched.title && formik.errors.title}
              {...formik.getFieldProps("title")}
            />

            <Input
              label="تاریخ انتشار"
              placeholder="مثال: 1404/06/15"
              error={formik.touched.date && formik.errors.date}
              {...formik.getFieldProps("date")}
            />
          </div>

          <Textarea
            label="توضیحات و متن مقاله"
            rows={5}
            placeholder="متن کامل بلاگ را اینجا بنویسید..."
            error={formik.touched.description && formik.errors.description}
            {...formik.getFieldProps("description")}
          />

          <div className="border-t border-border/80 pt-5">
            <ImageUpload
              label="تصویر شاخص"
              imagePreview={imagePreview}
              onChange={handleImageSelect}
              error={formik.touched.img && formik.errors.img}
              placeholder="برای آپلود تصویر شاخص بلاگ کلیک کنید"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border/80">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
            >
              ثبت و انتشار بلاگ
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}