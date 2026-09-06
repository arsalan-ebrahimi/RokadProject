// ==========================================
// Page Component: CreateComment
// Form for creating testimonials with support for preset default avatars or custom file upload
// ==========================================

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { DEFAULT_AVATARS } from "../../../Constants/defaultAvatars";
import { Button, Input, Textarea, PageHeader, Card } from "../../../Components/UI";

// Regular expression to restrict input to safe alphanumeric characters and standard Persian/Latin punctuation
const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/;

/**
 * Yup validation schema for creating a testimonial comment.
 */
const commentValidationSchema = Yup.object({
  author: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("نام نویسنده الزامی است"),
  content: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("متن نظر الزامی است"),
  role: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("نقش نویسنده الزامی است"),
  img: Yup.mixed().required("انتخاب تصویر یا آواتار الزامی است"),
});

/**
 * CreateComment page component for submitting new testimonials.
 */
export default function CreateComment() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      author: "",
      content: "",
      role: "",
      img: null,
    },
    validationSchema: commentValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let finalImageName = values.img;

        if (values.img instanceof File) {
          const formData = new FormData();
          formData.append("file", values.img);

          const uploadData = await axiosInstance.post("upload", formData);

          if (!uploadData || !uploadData.success) {
            throw new Error(uploadData?.message || "آپلود عکس با خطا مواجه شد");
          }
          finalImageName = uploadData.data;
        }

        const payload = {
          author: values.author,
          content: values.content,
          role: values.role,
          img: finalImageName,
        };

        const response = await axiosInstance.post("comment", payload);

        if (response && response.success !== false) {
          Notify("success", "نظر با موفقیت ثبت شد.");
          window.history.back();
        } else {
          throw new Error(response?.message || "ثبت نظر با خطا مواجه شد");
        }
      } catch (error) {
        Notify("error", error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleCustomImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/svg+xml",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        Notify("error", "فرمت فایل غیرمجاز است. فقط JPG, JPEG, PNG, SVG, WEBP مجاز است.");
        e.target.value = "";
        return;
      }
      if (file.name.toLowerCase().startsWith("default-")) {
        Notify("error", "نام فایل مجاز نیست. لطفاً نام فایل را تغییر دهید.");
        e.target.value = "";
        return;
      }
      formik.setFieldValue("img", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSelectDefaultAvatar = (filename) => {
    formik.setFieldValue("img", filename);
    setImagePreview(`/default-avatars/${filename}`);
  };

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="افزودن نظر جدید"
        subtitle="ثبت نظر دانش‌آموزان، والدین و همکاران گرامی"
        backTo="/comment"
      />

      <Card className="p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="نام نویسنده"
              placeholder="مثال: محمد محمدی"
              error={formik.touched.author && formik.errors.author}
              {...formik.getFieldProps("author")}
            />

            <Input
              label="نقش"
              placeholder="مثال: اولیای دانش‌آموز، معلم، مدیر"
              error={formik.touched.role && formik.errors.role}
              {...formik.getFieldProps("role")}
            />
          </div>

          <Textarea
            label="متن نظر"
            rows={4}
            placeholder="متن کامل نظر یا بازخورد را اینجا بنویسید..."
            error={formik.touched.content && formik.errors.content}
            {...formik.getFieldProps("content")}
          />

          {/* Avatar Selection Area */}
          <div className="flex flex-col gap-3 border-t border-border/80 pt-5">
            <label className="text-xs md:text-sm font-semibold text-text-primary select-none">
              انتخاب آواتار پیش‌فرض یا آپلود تصویر اختصاصی
            </label>

            <div className="flex gap-3 flex-wrap">
              {DEFAULT_AVATARS.map((avatar) => {
                const isSelected = formik.values.img === avatar.filename;
                return (
                  <div
                    key={`avatar-${avatar.id}`}
                    onClick={() => handleSelectDefaultAvatar(avatar.filename)}
                    className={`w-14 h-14 rounded-full cursor-pointer transition-all hover:scale-105 p-0.5 border-2 ${
                      isSelected
                        ? "border-primary shadow-sm ring-4 ring-primary/20 scale-105"
                        : "border-border hover:border-border-hover"
                    }`}
                  >
                    <img
                      src={`/default-avatars/${avatar.filename}`}
                      alt={avatar.alt}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                );
              })}
            </div>

            <span className="text-xs text-text-muted font-bold my-1">یا</span>

            <div className="w-full md:w-1/2 h-32 border-2 border-dashed border-border hover:border-primary rounded-xl flex flex-col items-center justify-center gap-2 bg-bg-light/60 hover:bg-teal-50/30 transition-colors cursor-pointer relative overflow-hidden group">
              <input
                id="custom-img"
                type="file"
                accept="image/jpeg, image/jpg, image/png, image/svg+xml, image/webp"
                onChange={handleCustomImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imagePreview && formik.values.img instanceof File ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                    تغییر عکس شخصی
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 p-3 text-center">
                  <CloudUploadIcon className="text-primary" />
                  <p className="text-xs font-semibold text-text-secondary">
                    آپلود عکس شخصی
                  </p>
                </div>
              )}
            </div>

            {formik.touched.img && formik.errors.img && (
              <span className="text-xs text-error font-medium animate-fadeIn">
                {formik.errors.img}
              </span>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-border/80">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
            >
              ثبت نظر
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}