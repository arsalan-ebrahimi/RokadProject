import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../Utils/axiosInstance";
import Notify from "../../Utils/notify";
import Loading from "../../Components/Loading";
import { Button, Input, Textarea, PageHeader, Card } from "../../Components/UI";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/;
const SeoSchema = Yup.object({
  title: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("وارد کردن عنوان سایت الزامی است"),
  description: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .required("وارد کردن توضیحات سایت الزامی است"),
  keywords: Yup.string().matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست"),
  robots: Yup.string(),
  canonicalUrl: Yup.string(),
  ogTitle: Yup.string().matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست"),
  ogDescription: Yup.string().matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست"),
  ogImage: Yup.string(),
  ogType: Yup.string(),
  twitterCard: Yup.string(),
  twitterTitle: Yup.string().matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست"),
  twitterDescription: Yup.string().matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست"),
  twitterImage: Yup.string(),
});

export default function SeoSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    keywords: "",
    robots: "index, follow",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  });

  useEffect(() => {
    const getSeoData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("seo");

        let data = null;
        if (response && response.data) {
          data = Array.isArray(response.data) ? response.data[0] : response.data;
        } else if (Array.isArray(response)) {
          data = response[0];
        }

        if (data) {
          setInitialValues({
            title: data.title || "",
            description: data.description || "",
            keywords: data.keywords || "",
            robots: data.robots || "index, follow",
            canonicalUrl: data.canonicalUrl || "",
            ogTitle: data.ogTitle || "",
            ogDescription: data.ogDescription || "",
            ogImage: data.ogImage || "",
            ogType: data.ogType || "website",
            twitterCard: data.twitterCard || "summary_large_image",
            twitterTitle: data.twitterTitle || "",
            twitterDescription: data.twitterDescription || "",
            twitterImage: data.twitterImage || "",
          });
        }
      } catch (error) {
        console.error("Fetch SEO Error:", error);
        Notify("error", error.message || "خطا در ارتباط با سرور");
      }
      setLoading(false);
    };

    getSeoData();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: SeoSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await axiosInstance.patch("seo", values);

        if (response && (response.success || response.status === "success")) {
          Notify("success", "تنظیمات سئو با موفقیت بروزرسانی شد.");
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
        title="مدیریت سئو سایت (SEO)"
        subtitle="تنظیم متاتگ‌ها، اپن گراف و کارت‌های توییتر"
        backTo="/"
        backLabel="بازگشت به داشبورد"
      />

      <Card className="p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
          {/* Basic SEO Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base md:text-lg font-bold text-secondary border-b border-border/80 pb-2">
              تنظیمات پایه (Basic SEO)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
              <Input
                label="عنوان سایت (Title)"
                placeholder="مثال: هنرستان فناوری رکاد"
                error={formik.touched.title && formik.errors.title}
                {...formik.getFieldProps("title")}
              />

              <Input
                label="ربات‌ها (Robots)"
                placeholder="مثال: index, follow"
                error={formik.touched.robots && formik.errors.robots}
                {...formik.getFieldProps("robots")}
              />

              <div className="col-span-1 md:col-span-2">
                <Textarea
                  label="توضیحات (Description)"
                  rows={3}
                  placeholder="توضیحات پیش‌فرض سایت برای موتورهای جستجو..."
                  error={formik.touched.description && formik.errors.description}
                  {...formik.getFieldProps("description")}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <Input
                  label="کلمات کلیدی (Keywords)"
                  placeholder="کلمات را با کاما جدا کنید (مثال: هنرستان, برنامه نویسی, گرافیک)"
                  error={formik.touched.keywords && formik.errors.keywords}
                  {...formik.getFieldProps("keywords")}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <Input
                  label="آدرس کنونیکال (Canonical URL)"
                  placeholder="https://..."
                  dir="ltr"
                  error={formik.touched.canonicalUrl && formik.errors.canonicalUrl}
                  {...formik.getFieldProps("canonicalUrl")}
                />
              </div>
            </div>
          </div>

          {/* Open Graph Section */}
          <div className="flex flex-col gap-4 border-t border-border/80 pt-6">
            <h2 className="text-base md:text-lg font-bold text-secondary border-b border-border/80 pb-2">
              تنظیمات شبکه‌های اجتماعی (Open Graph)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
              <Input
                label="عنوان (OG Title)"
                placeholder="عنوان اشتراک‌گذاری"
                error={formik.touched.ogTitle && formik.errors.ogTitle}
                {...formik.getFieldProps("ogTitle")}
              />

              <Input
                label="نوع (OG Type)"
                placeholder="مثال: website"
                error={formik.touched.ogType && formik.errors.ogType}
                {...formik.getFieldProps("ogType")}
              />

              <div className="col-span-1 md:col-span-2">
                <Textarea
                  label="توضیحات (OG Description)"
                  rows={2}
                  placeholder="توضیحات اشتراک‌گذاری در شبکه‌های اجتماعی..."
                  error={formik.touched.ogDescription && formik.errors.ogDescription}
                  {...formik.getFieldProps("ogDescription")}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <Input
                  label="لینک تصویر (OG Image)"
                  placeholder="https://..."
                  dir="ltr"
                  error={formik.touched.ogImage && formik.errors.ogImage}
                  {...formik.getFieldProps("ogImage")}
                />
              </div>
            </div>
          </div>

          {/* Twitter Cards Section */}
          <div className="flex flex-col gap-4 border-t border-border/80 pt-6">
            <h2 className="text-base md:text-lg font-bold text-secondary border-b border-border/80 pb-2">
              تنظیمات توییتر (Twitter Cards)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
              <Input
                label="نوع کارت (Twitter Card)"
                placeholder="مثال: summary_large_image"
                error={formik.touched.twitterCard && formik.errors.twitterCard}
                {...formik.getFieldProps("twitterCard")}
              />

              <Input
                label="عنوان توییتر (Twitter Title)"
                placeholder="عنوان برای توییتر"
                error={formik.touched.twitterTitle && formik.errors.twitterTitle}
                {...formik.getFieldProps("twitterTitle")}
              />

              <div className="col-span-1 md:col-span-2">
                <Textarea
                  label="توضیحات توییتر (Twitter Description)"
                  rows={2}
                  placeholder="توضیحات برای کارت توییتر..."
                  error={formik.touched.twitterDescription && formik.errors.twitterDescription}
                  {...formik.getFieldProps("twitterDescription")}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <Input
                  label="لینک تصویر توییتر (Twitter Image)"
                  placeholder="https://..."
                  dir="ltr"
                  error={formik.touched.twitterImage && formik.errors.twitterImage}
                  {...formik.getFieldProps("twitterImage")}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-border/80">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
            >
              ذخیره تغییرات سئو
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}