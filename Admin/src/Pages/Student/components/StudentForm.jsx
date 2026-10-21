// ==========================================
// Component: StudentForm
// Form for student profile registration and editing with Identity Card (شناسنامه دانش‌آموز),
// long biography, Rokad journey story, achievements, key activities, and portfolio links
// ==========================================

import React, { useState, useEffect } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShareIcon from "@mui/icons-material/Share";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";

import {
  Button,
  Input,
  Select,
  Textarea,
  PageHeader,
  Card,
  ImageUpload,
  FormActionBar,
} from "../../../Components/UI";
import { toEnglishDigits } from "../../../Utils/toEnglishDigits";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-_،؛؟!.:«»",;?()/\u200c\u200d]+$/u;

const studentValidationSchema = Yup.object({
  fullName: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .max(100, "نام کامل حداکثر ۱۰۰ کاراکتر است")
    .required("وارد کردن نام کامل الزامی است"),
  job: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .max(150, "وضعیت شغلی حداکثر ۱۵۰ کاراکتر است")
    .required("وارد کردن وضعیت شغلی فعلی الزامی است"),
  generation: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const trimmed = toEnglishDigits(originalValue.trim());
        return trimmed === "" ? undefined : Number(trimmed);
      }
      return value;
    })
    .typeError("نسل باید یک عدد باشد")
    .integer("نسل باید عدد صحیح باشد")
    .min(1, "نسل باید حداقل ۱ باشد")
    .required("تعیین نسل دانش‌آموز الزامی است"),
  schoolType: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("انتخاب نوع مدرسه الزامی است"),
  major: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("انتخاب رشته تحصیلی الزامی است"),
  img: Yup.mixed().required("انتخاب تصویر پرسنلی دانش‌آموز الزامی است"),

  // Identity Card fields
  currentCity: Yup.string().max(100),
  graduationYear: Yup.string().max(50),
  portfolioCount: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null || originalValue === undefined) return 0;
      if (typeof originalValue === "string") {
        const num = Number(toEnglishDigits(originalValue.trim()));
        return isNaN(num) ? originalValue : num;
      }
      return value;
    })
    .typeError("تعداد نمونه‌کارها باید عدد باشد")
    .integer("تعداد نمونه‌کارها باید عدد صحیح باشد")
    .min(0, "تعداد نمی‌تواند منفی باشد")
    .default(0),

  // Extended bio & narrative
  about: Yup.string().max(10000),
  rokadStory: Yup.string().max(10000),
  achievements: Yup.string().max(5000),

  // Key activities
  keyActivities: Yup.array()
    .transform((value, originalValue) => {
      if (!Array.isArray(originalValue)) return value;
      return originalValue.filter((item) => item?.title && item.title.trim());
    })
    .of(
      Yup.object({
        title: Yup.string()
          .matches(safeTextRegex, "عنوان فعالیت شامل کاراکتر غیرمجاز است")
          .required("عنوان فعالیت الزامی است"),
        description: Yup.string().max(2000),
      })
    ),

  // Social links
  socialLinks: Yup.array()
    .transform((value, originalValue) => {
      if (!Array.isArray(originalValue)) return value;
      return originalValue.filter(
        (item) => (item?.type && item.type.trim()) || (item?.link && item.link.trim())
      );
    })
    .of(
      Yup.object({
        type: Yup.string()
          .matches(safeTextRegex, "نوع شبکه نامعتبر است")
          .required("نوع شبکه الزامی است"),
        link: Yup.string().required("لینک الزامی است"),
      })
    ),
});

export default function StudentForm({
  initialValues = {
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
  },
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  existingImageUrl = null,
  pageTitle = "افزودن دانش‌آموز جدید",
  pageSubtitle = "ثبت شناسنامه، رزومه شغلی، فعالیت‌های کلیدی و پرونده دانش‌آموز",
}) {
  const [imagePreview, setImagePreview] = useState(existingImageUrl || null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: studentValidationSchema,
    onSubmit: async (values) => {
      const cleanedActivities = (values.keyActivities || []).filter(
        (act) => act?.title && act.title.trim()
      );
      const cleanedSocials = (values.socialLinks || []).filter(
        (s) => s?.type && s.type.trim() && s?.link && s.link.trim()
      );

      await onSubmit({
        ...values,
        generation: Number(toEnglishDigits(String(values.generation || ""))),
        portfolioCount:
          Number(toEnglishDigits(String(values.portfolioCount || 0))) || 0,
        keyActivities: cleanedActivities,
        socialLinks: cleanedSocials,
      });
    },
  });

  // Synchronize image preview with existingImageUrl on updates
  useEffect(() => {
    if (!(formik.values.img instanceof File)) {
      setImagePreview(existingImageUrl || null);
    }
  }, [existingImageUrl]);

  const handleImageSelect = (file) => {
    formik.setFieldValue("img", file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(existingImageUrl || null);
    }
  };

  const handleFormSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        fullName: true,
        job: true,
        generation: true,
        schoolType: true,
        major: true,
        img: true,
      });
    }

    formik.handleSubmit(e);
  };

  return (
    <div dir="rtl" className="p-4 sm:p-6 md:p-8 w-full bg-background min-h-dvh">
      <PageHeader
        title={pageTitle}
        subtitle={pageSubtitle}
        backTo="/student"
      />

      <Card className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
        <FormikProvider value={formik}>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-8 pb-20 md:pb-6">
            {/* 1. Basic Identity Information */}

            <div className="flex flex-col gap-5">
              <h3 className="text-base font-bold text-secondary border-b border-border/80 pb-2 flex items-center gap-2">
                <SchoolIcon fontSize="small" className="text-primary" />
                <span>اطلاعات اولیه و آموزشی</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="نام و نام خانوادگی"
                  placeholder="مثال: محمد رضایی"
                  error={formik.touched.fullName && formik.errors.fullName}
                  {...formik.getFieldProps("fullName")}
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
                        label:
                          "تولید و توسعه پایگاه‌های اینترنتی (برنامه نویسی و طراحی سایت)",
                        value:
                          "تولید و توسعه پایگاه‌های اینترنتی (برنامه نویسی و طراحی سایت)",
                      },
                      {
                        label:
                          "تولید محتوای چندرسانه‌ای (طراحی گرافیک و تولید محتوای ویدئویی و صوتی)",
                        value:
                          "تولید محتوای چندرسانه‌ای (طراحی گرافیک و تولید محتوای ویدئویی و صوتی)",
                      },
                    ]}
                    {...formik.getFieldProps("major")}
                  />
                </div>
              </div>
            </div>

            {/* 2. Student Identity Card (شناسنامه دانش‌آموز) */}
            <div className="flex flex-col gap-5 border-t border-border/80 pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-secondary flex items-center gap-2">
                  <BadgeIcon fontSize="small" className="text-primary" />
                  <span>شناسنامه دانش‌آموز</span>
                </h3>
                <span className="text-xs text-text-muted">
                  مشخصات رسمی جهت نمایش در شناسنامه پرونده
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-bg-light/50 p-5 rounded-2xl border border-border">
                <Input
                  label="وضعیت شغلی فعلی"
                  placeholder="مثال: توسعه‌دهنده فرانت‌اند در اسنپ"
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

                <Input
                  label="شهر فعالیت کنونی"
                  placeholder="مثال: مشهد، تهران..."
                  error={formik.touched.currentCity && formik.errors.currentCity}
                  {...formik.getFieldProps("currentCity")}
                />

                <Input
                  label="سال فارغ‌التحصیلی"
                  placeholder="مثال: 1402"
                  error={
                    formik.touched.graduationYear &&
                    formik.errors.graduationYear
                  }
                  {...formik.getFieldProps("graduationYear")}
                />

                <Input
                  type="number"
                  label="تعداد نمونه‌کارها"
                  placeholder="مثال: 12"
                  error={
                    formik.touched.portfolioCount &&
                    formik.errors.portfolioCount
                  }
                  {...formik.getFieldProps("portfolioCount")}
                />
              </div>
            </div>

            {/* 3. About & Rokad Journey Narrative */}
            <div className="flex flex-col gap-5 border-t border-border/80 pt-6">
              <h3 className="text-base font-bold text-secondary flex items-center gap-2">
                <AutoStoriesIcon fontSize="small" className="text-primary" />
                <span>بیوگرافی و روایت از رکاد</span>
              </h3>

              <Textarea
                label="درباره دانش‌آموز (توضیح بلند و بیوگرافی)"
                rows={5}
                placeholder="توضیح کامل درباره مسیر یادگیری، علایق، مهارت‌ها و اهداف شغلی..."
                error={formik.touched.about && formik.errors.about}
                {...formik.getFieldProps("about")}
              />

              <Textarea
                label="روایتی که از رکاد داشته"
                rows={4}
                placeholder="خاطره و تجربه دانش‌آموز از دوران تحصیل، اساتید، پروژه‌ها و فضای هنرستان رکاد..."
                error={formik.touched.rokadStory && formik.errors.rokadStory}
                {...formik.getFieldProps("rokadStory")}
              />
            </div>

            {/* 4. Achievements and Honors (دستاوردها و افتخارات) */}
            <div className="flex flex-col gap-3 border-t border-border/80 pt-6">
              <h3 className="text-base font-bold text-secondary flex items-center gap-2">
                <EmojiEventsIcon fontSize="small" className="text-primary" />
                <span>دستاوردها و افتخارات (اختیاری)</span>
              </h3>

              <Textarea
                rows={3}
                placeholder="کسب رتبه‌های المپیادی، مسابقات کشوری، قبولی در دانشگاه یا پروژه‌های موفق تجاری..."
                error={formik.touched.achievements && formik.errors.achievements}
                {...formik.getFieldProps("achievements")}
              />
            </div>

            {/* 5. Key Activities (فعالیت‌های کلیدی در دوران دانش‌آموزی) */}
            <div className="flex flex-col gap-4 border-t border-border/80 pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-secondary flex items-center gap-2">
                  <LocalActivityIcon fontSize="small" className="text-primary" />
                  <span>فعالیت‌های کلیدی در دوران دانش‌آموزی</span>
                </h3>
                <span className="text-xs text-text-muted">
                  مشابه تگ به همراه توضیحات
                </span>
              </div>

              <FieldArray name="keyActivities">
                {({ push, remove }) => (
                  <div className="flex flex-col gap-3">
                    {formik.values.keyActivities?.map((act, index) => {
                      const titleErr =
                        formik.errors.keyActivities?.[index]?.title;
                      const touchedTitle =
                        formik.touched.keyActivities?.[index]?.title;

                      return (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-bg-light/60 p-4 rounded-xl border border-border"
                        >
                          <div className="w-full md:w-1/3">
                            <Input
                              placeholder="عنوان فعالیت (مثلاً مسئول تیم رباتیک)..."
                              error={touchedTitle && titleErr}
                              {...formik.getFieldProps(
                                `keyActivities[${index}].title`
                              )}
                            />
                          </div>

                          <div className="w-full md:w-2/3">
                            <Input
                              placeholder="توضیحات تکمیلی این فعالیت..."
                              {...formik.getFieldProps(
                                `keyActivities[${index}].description`
                              )}
                            />
                          </div>

                          <Button
                            type="button"
                            variant="danger-ghost"
                            size="icon-sm"
                            onClick={() => remove(index)}
                            title="حذف فعالیت"
                            className="shrink-0"
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </Button>
                        </div>
                      );
                    })}

                    <Button
                      type="button"
                      variant="primary-subtle"
                      size="sm"
                      onClick={() => push({ title: "", description: "" })}
                      icon={<AddIcon fontSize="small" />}
                      className="self-start mt-1"
                    >
                      افزودن فعالیت کلیدی جدید
                    </Button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* 6. Social Links & Resume */}
            <div className="flex flex-col gap-4 border-t border-border/80 pt-6">
              <h3 className="text-base font-bold text-secondary flex items-center gap-2">
                <ShareIcon fontSize="small" className="text-primary" />
                <span>شبکه‌های اجتماعی و لینک‌های نمونه‌کار</span>
              </h3>

              <FieldArray name="socialLinks">
                {({ push, remove }) => (
                  <div className="flex flex-col gap-3">
                    {formik.values.socialLinks?.map((social, index) => {
                      const typeError =
                        formik.errors.socialLinks?.[index]?.type;
                      const linkError =
                        formik.errors.socialLinks?.[index]?.link;
                      const touchedType =
                        formik.touched.socialLinks?.[index]?.type;
                      const touchedLink =
                        formik.touched.socialLinks?.[index]?.link;

                      return (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row gap-3 items-center bg-bg-light/60 p-3.5 rounded-xl border border-border"
                        >
                          <div className="w-full md:w-1/3">
                            <Input
                              placeholder="نوع (مثال: Github, LinkedIn, Dribbble)"
                              error={touchedType && typeError}
                              {...formik.getFieldProps(
                                `socialLinks[${index}].type`
                              )}
                            />
                          </div>

                          <div className="w-full">
                            <Input
                              dir="ltr"
                              placeholder="https://..."
                              error={touchedLink && linkError}
                              {...formik.getFieldProps(
                                `socialLinks[${index}].link`
                              )}
                            />
                          </div>

                          <Button
                            type="button"
                            variant="danger-ghost"
                            size="icon-sm"
                            onClick={() => remove(index)}
                            title="حذف لینک"
                            className="shrink-0"
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </Button>
                        </div>
                      );
                    })}

                    <Button
                      type="button"
                      variant="primary-subtle"
                      size="sm"
                      onClick={() => push({ type: "", link: "" })}
                      icon={<AddIcon fontSize="small" />}
                      className="self-start mt-1"
                    >
                      افزودن لینک شبکه اجتماعی
                    </Button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* 7. Avatar Image Upload */}
            <div className="border-t border-border/80 pt-6">
              <ImageUpload
                label="تصویر پرسنلی دانش‌آموز"
                imagePreview={imagePreview}
                onChange={handleImageSelect}
                error={formik.touched.img && formik.errors.img}
                placeholder="برای آپلود عکس پرسنلی دانش‌آموز کلیک کنید"
              />
            </div>

            {/* Submit Action Bar */}
            <div className="pt-4 border-t border-border/80">
              <FormActionBar
                submitLabel={isEdit ? "ذخیره تغییرات پرونده" : "ثبت پرونده دانش‌آموز"}
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </FormikProvider>
      </Card>
    </div>
  );
}

