import React, { useState } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { Button, Input, Select, PageHeader, Card, ImageUpload } from "../../../Components/UI";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?]+$/;
const studentValidationSchema = Yup.object({
  fullName: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("وارد کردن نام کامل الزامی است"),
  job: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("وارد کردن شغل الزامی است"),
  generation: Yup.number()
    .typeError("نسل باید عدد باشد")
    .required("تعیین نسل الزامی است"),
  schoolType: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("نوع مدرسه الزامی است"),
  major: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("رشته تحصیلی الزامی است"),
  img: Yup.mixed().required("انتخاب تصویر دانش‌آموز الزامی است"),
  socialLinks: Yup.array().of(
    Yup.object({
      type: Yup.string()
        .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
        .required("نوع شبکه الزامی است"),
      link: Yup.string().required("لینک الزامی است"),
    })
  ),
});

export default function CreateStudent() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      job: "",
      generation: "",
      schoolType: "",
      major: "",
      img: null,
      socialLinks: [],
    },
    validationSchema: studentValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("file", values.img);

        const uploadData = await axiosInstance.post("upload", formData);

        if (!uploadData || !uploadData.success) {
          throw new Error(uploadData?.message || "آپلود تصویر با خطا مواجه شد");
        }

        const uploadedFilename = uploadData.data;

        const payload = {
          fullName: values.fullName,
          job: values.job,
          generation: Number(values.generation),
          schoolType: values.schoolType,
          major: values.major,
          img: uploadedFilename,
          socialLinks: values.socialLinks,
        };

        const response = await axiosInstance.post("student", payload);

        if (response && response.success !== false) {
          Notify("success", "دانش‌آموز با موفقیت ثبت شد.");
          window.history.back();
        } else {
          throw new Error(response?.message || "ثبت دانش‌آموز با خطا مواجه شد");
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
        title="افزودن دانش‌آموز جدید"
        subtitle="اطلاعات و تصویر دانش‌آموز فارغ‌التحصیل یا برجسته را وارد نمایید"
        backTo="/student"
      />

      <Card className="p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="نام کامل"
                placeholder="مثال: محمد رضایی"
                error={formik.touched.fullName && formik.errors.fullName}
                {...formik.getFieldProps("fullName")}
              />

              <Input
                label="شغل فعلی"
                placeholder="مثال: توسعه‌دهنده فرانت‌اند"
                error={formik.touched.job && formik.errors.job}
                {...formik.getFieldProps("job")}
              />

              <Input
                type="number"
                label="نسل (عدد)"
                placeholder="مثال: 3"
                error={formik.touched.generation && formik.errors.generation}
                {...formik.getFieldProps("generation")}
              />

              <Select
                label="نوع مدرسه"
                error={formik.touched.schoolType && formik.errors.schoolType}
                options={["هنرستان پسرانه رکاد", "هنرستان دخترانه رکاد"]}
                {...formik.getFieldProps("schoolType")}
              />

              <div className="col-span-1 md:col-span-2">
                <Select
                  label="رشته تحصیلی"
                  error={formik.touched.major && formik.errors.major}
                  options={[
                    {
                      label: "تولید و توسعه پایگاه‌های اینترنتی (برنامه نویسی و طراحی سایت)",
                      value: "تولید و توسعه پایگاه‌های اینترنتی (برنامه نویسی و طراحی سایت)",
                    },
                    {
                      label: "تولید محتوای چندرسانه‌ای (طراحی گرافیک و تولید محتوای ویدئویی و صوتی)",
                      value: "تولید محتوای چندرسانه‌ای (طراحی گرافیک و تولید محتوای ویدئویی و صوتی)",
                    },
                  ]}
                  {...formik.getFieldProps("major")}
                />
              </div>
            </div>

            {/* Social Links Section */}
            <div className="flex flex-col gap-3 border-t border-border/80 pt-5">
              <label className="text-xs md:text-sm font-semibold text-text-primary select-none">
                شبکه‌های اجتماعی و رزومه
              </label>

              <FieldArray name="socialLinks">
                {({ push, remove }) => (
                  <div className="flex flex-col gap-3">
                    {formik.values.socialLinks.map((social, index) => {
                      const typeError = formik.errors.socialLinks?.[index]?.type;
                      const linkError = formik.errors.socialLinks?.[index]?.link;
                      const touchedType = formik.touched.socialLinks?.[index]?.type;
                      const touchedLink = formik.touched.socialLinks?.[index]?.link;

                      return (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row gap-3 items-center bg-bg-light/60 p-3.5 rounded-xl border border-border"
                        >
                          <div className="w-full md:w-1/3">
                            <Input
                              placeholder="نوع (مثال: Github, LinkedIn)"
                              error={touchedType && typeError}
                              {...formik.getFieldProps(`socialLinks[${index}].type`)}
                            />
                          </div>

                          <div className="w-full">
                            <Input
                              dir="ltr"
                              placeholder="https://..."
                              error={touchedLink && linkError}
                              {...formik.getFieldProps(`socialLinks[${index}].link`)}
                            />
                          </div>

                          <Button
                            variant="danger-ghost"
                            size="icon-sm"
                            onClick={() => remove(index)}
                            title="حذف این لینک"
                            className="shrink-0"
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </Button>
                        </div>
                      );
                    })}

                    <Button
                      variant="primary-subtle"
                      size="sm"
                      onClick={() => push({ type: "", link: "" })}
                      icon={<AddIcon fontSize="small" />}
                      className="self-start mt-1"
                    >
                      افزودن لینک جدید
                    </Button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Image Upload Area */}
            <div className="border-t border-border/80 pt-5">
              <ImageUpload
                label="تصویر دانش‌آموز"
                imagePreview={imagePreview}
                onChange={handleImageSelect}
                error={formik.touched.img && formik.errors.img}
                placeholder="برای آپلود تصویر دانش‌آموز کلیک کنید"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-border/80">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
              >
                ثبت دانش‌آموز
              </Button>
            </div>
          </form>
        </FormikProvider>
      </Card>
    </div>
  );
}