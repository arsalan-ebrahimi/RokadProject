import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { DEFAULT_AVATARS } from "../../../Constants/defaultAvatars";
import { getImageUrl } from "../../../Utils/getImageUrl";
import Loading from "../../../Components/Loading";
import { Button, Input, Textarea, PageHeader, Card } from "../../../Components/UI";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?]+$/;
const commentUpdateSchema = Yup.object({
  author: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("نام نویسنده الزامی است"),
  content: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("متن نظر الزامی است"),
  role: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("نقش نویسنده الزامی است"),
});

export default function UpdateComment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const [initialValues, setInitialValues] = useState({
    author: "",
    content: "",
    role: "",
    img: null,
  });

  useEffect(() => {
    const getCommentData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`comment/${id}`);

        let data = null;
        if (response && response.data) {
          data = Array.isArray(response.data) ? response.data[0] : response.data;
        } else if (Array.isArray(response)) {
          data = response[0];
        }

        if (data) {
          setInitialValues({
            author: data.author || "",
            content: data.content || "",
            role: data.role || "",
            img: data.img || null,
          });

          if (data.img) setImagePreview(getImageUrl(data.img));
        }
      } catch (error) {
        Notify("error", error.message || "خطا در دریافت اطلاعات نظر");
      }
      setLoading(false);
    };

    if (id) getCommentData();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: commentUpdateSchema,
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

        const payload = {
          author: values.author,
          content: values.content,
          role: values.role,
          img: finalImageName,
        };

        const response = await axiosInstance.patch(`comment/${id}`, payload);

        if (response && (response.success || response.status === "success")) {
          Notify("success", "نظر با موفقیت ویرایش شد.");
          navigate("/comment");
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
        title="ویرایش نظر"
        subtitle="ویرایش جزئیات نظر، نام نویسنده و آواتار"
        backTo="/comment"
      />

      <Card className="p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="نام نویسنده"
              error={formik.touched.author && formik.errors.author}
              {...formik.getFieldProps("author")}
            />

            <Input
              label="نقش"
              placeholder="مثال: اولیای دانش‌آموز"
              error={formik.touched.role && formik.errors.role}
              {...formik.getFieldProps("role")}
            />
          </div>

          <Textarea
            label="متن نظر"
            rows={4}
            error={formik.touched.content && formik.errors.content}
            {...formik.getFieldProps("content")}
          />

          {/* Avatar Selection Area */}
          <div className="flex flex-col gap-3 border-t border-border/80 pt-5">
            <label className="text-xs md:text-sm font-semibold text-text-primary select-none">
              تغییر آواتار پیش‌فرض یا آپلود تصویر اختصاصی
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
              {imagePreview &&
              (formik.values.img instanceof File ||
                (typeof formik.values.img === "string" &&
                  !formik.values.img.startsWith("default-"))) ? (
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
                    آپلود عکس جدید
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
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}