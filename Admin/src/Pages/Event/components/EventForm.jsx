// ==========================================
// Component: EventForm
// Form for creating and editing events with organizers (mentors, judges, staff),
// podium & honored teams, deadlines timeline, quotes, and tags
// ==========================================

import React, { useState, useEffect, useRef } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Card,
  PageHeader,
  ImageUpload,
} from "../../../Components/UI";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d\/]+$/;

export const eventValidationSchema = Yup.object({
  title: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .max(200, "عنوان حداکثر ۲۰۰ کاراکتر است")
    .required("عنوان رویداد الزامی است"),
  type: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("نوع رویداد الزامی است"),
  date: Yup.string()
    .matches(safeTextRegex, "مقدار غیرمجاز")
    .required("تاریخ رویداد الزامی است"),
  description: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .required("توضیحات رویداد الزامی است"),
  branch: Yup.array()
    .of(Yup.string().oneOf(["دخترانه", "پسرانه"]))
    .min(1, "حداقل یک شعبه را انتخاب کنید")
    .required("مشخص کردن شعبه الزامی است"),
  img: Yup.mixed().required("انتخاب تصویر رویداد الزامی است"),

  // Extended fields
  eventDuration: Yup.string().max(100),
  closingLocation: Yup.string().max(200),
  holdingDate: Yup.string().max(100),

  // Minimum 3 organizers required
  organizers: Yup.array()
    .transform((value, originalValue) => {
      if (!Array.isArray(originalValue)) return value;
      return originalValue.filter(
        (item) =>
          (item?.name && item.name.trim()) || (item?.role && item.role.trim())
      );
    })
    .of(
      Yup.object({
        name: Yup.string()
          .matches(safeTextRegex, "نام شامل کاراکتر غیرمجاز است")
          .required("نام عضو کادر الزامی است"),
        role: Yup.string()
          .matches(safeTextRegex, "نقش شامل کاراکتر غیرمجاز است")
          .required("نقش عضو کادر الزامی است"),
        category: Yup.string()
          .oneOf(["منتور", "عوامل اجرایی", "داور"], "دسته‌بندی نامعتبر است")
          .required("انتخاب دسته‌بندی نقش الزامی است"),
      })
    )
    .min(3, "ثبت حداقل ۳ نفر از کادر برگزاری (منتور، داور یا عوامل اجرایی) الزامی است")
    .required("ثبت اعضای کادر رویداد الزامی است"),

  teams: Yup.object({
    firstTeam: Yup.object({
      name: Yup.string().max(150),
      isHonored: Yup.boolean(),
    }),
    secondTeam: Yup.object({
      name: Yup.string().max(150),
      isHonored: Yup.boolean(),
    }),
    thirdTeam: Yup.object({
      name: Yup.string().max(150),
      isHonored: Yup.boolean(),
    }),
    honoredTeams: Yup.array()
      .transform((value, originalValue) => {
        if (!Array.isArray(originalValue)) return value;
        return originalValue.filter((item) => item?.name && item.name.trim());
      })
      .of(
        Yup.object({
          name: Yup.string().required("نام تیم الزامی است"),
        })
      ),
  }),

  howItWent: Yup.string().max(10000),
  memorableQuote: Yup.object({
    quote: Yup.string().max(1000),
    speaker: Yup.string().max(100),
  }),
  deadlinesDescription: Yup.string().max(1000),
  deadlines: Yup.array()
    .transform((value, originalValue) => {
      if (!Array.isArray(originalValue)) return value;
      return originalValue.filter((item) => item?.title && item.title.trim());
    })
    .of(
      Yup.object({
        title: Yup.string()
          .matches(safeTextRegex, "عنوان شامل کاراکتر غیرمجاز است")
          .required("عنوان ددلاین الزامی است"),
        date: Yup.string(),
        description: Yup.string(),
      })
    ),
  tags: Yup.array()
    .of(
      Yup.string()
        .max(60, "طول هر تگ حداکثر ۶۰ کاراکتر است")
        .test("safe-tag", "تگ شامل کاراکتر غیرمجاز است", (val) => {
          if (!val || !val.trim()) return true;
          return safeTextRegex.test(val);
        })
    )
    .max(30, "حداکثر ۳۰ تگ مجاز است"),
});

const defaultEventInitialValues = {
  title: "",
  type: "",
  date: "",
  description: "",
  branch: [],
  img: null,
  eventDuration: "",
  closingLocation: "",
  holdingDate: "",
  organizers: [
    { name: "", role: "", category: "منتور" },
    { name: "", role: "", category: "داور" },
    { name: "", role: "", category: "عوامل اجرایی" },
  ],
  teams: {
    firstTeam: { name: "", isHonored: false },
    secondTeam: { name: "", isHonored: false },
    thirdTeam: { name: "", isHonored: false },
    honoredTeams: [],
  },
  howItWent: "",
  memorableQuote: { quote: "", speaker: "" },
  deadlinesDescription: "",
  deadlines: [],
  tags: [],
};

export default function EventForm({
  initialValues = defaultEventInitialValues,
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  existingImageUrl = null,
  pageTitle = "افزودن رویداد جدید",
  pageSubtitle = "ثبت مشخصات، کادر رویداد، تیم‌های برتر، ددلاین‌ها و گزارش برگزاری",
}) {
  const [imagePreview, setImagePreview] = useState(existingImageUrl || null);
  const [newTagInput, setNewTagInput] = useState("");
  const tagInputRef = useRef(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: eventValidationSchema,
    onSubmit: async (values) => {
      let finalTags = Array.isArray(values.tags) ? [...values.tags] : [];
      if (newTagInput.trim()) {
        const extraTags = newTagInput
          .trim()
          .split(/[،,]/)
          .map((t) => t.trim().replace(/^#+/, ""))
          .filter((t) => t && !finalTags.includes(t));
        finalTags = [...finalTags, ...extraTags];
      }

      const cleanedOrganizers = (values.organizers || []).filter(
        (o) => o?.name && o.name.trim() && o?.role && o.role.trim()
      );

      const cleanedHonoredTeams = (values.teams?.honoredTeams || []).filter(
        (ht) => ht?.name && ht.name.trim()
      );

      const cleanedDeadlines = (values.deadlines || []).filter(
        (dl) => dl?.title && dl.title.trim()
      );

      await onSubmit({
        ...values,
        tags: finalTags,
        organizers: cleanedOrganizers,
        teams: {
          ...values.teams,
          firstTeam: {
            name: values.teams?.firstTeam?.name || "",
            isHonored: Boolean(values.teams?.firstTeam?.isHonored),
          },
          secondTeam: {
            name: values.teams?.secondTeam?.name || "",
            isHonored: Boolean(values.teams?.secondTeam?.isHonored),
          },
          thirdTeam: {
            name: values.teams?.thirdTeam?.name || "",
            isHonored: Boolean(values.teams?.thirdTeam?.isHonored),
          },
          honoredTeams: cleanedHonoredTeams,
        },
        deadlines: cleanedDeadlines,
      });
      setNewTagInput("");
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

  const handleAddTag = () => {
    const raw = newTagInput.trim();
    if (!raw) {
      if (tagInputRef.current) tagInputRef.current.focus();
      return;
    }

    const parsedTags = raw
      .split(/[،,]/)
      .map((t) => t.trim().replace(/^#+/, ""))
      .filter((t) => t.length > 0);

    const current = Array.isArray(formik.values.tags) ? formik.values.tags : [];
    const updated = [...current];

    parsedTags.forEach((t) => {
      if (!updated.includes(t)) {
        updated.push(t);
      }
    });

    formik.setFieldValue("tags", updated);
    setNewTagInput("");
  };

  const handleRemoveTag = (indexToRemove) => {
    const updated = formik.values.tags.filter((_, idx) => idx !== indexToRemove);
    formik.setFieldValue("tags", updated);
  };

  const handleFormSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (newTagInput.trim()) {
      const extraTags = newTagInput
        .trim()
        .split(/[،,]/)
        .map((t) => t.trim().replace(/^#+/, ""))
        .filter((t) => t.length > 0);

      const current = Array.isArray(formik.values.tags) ? formik.values.tags : [];
      const updated = [...current];

      extraTags.forEach((t) => {
        if (!updated.includes(t)) {
          updated.push(t);
        }
      });

      formik.setFieldValue("tags", updated);
      setNewTagInput("");
    }

    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        title: true,
        type: true,
        date: true,
        description: true,
        branch: true,
        img: true,
        tags: true,
      });
      return;
    }

    formik.handleSubmit(e);
  };

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title={pageTitle}
        subtitle={pageSubtitle}
        backTo="/event"
      />

      <Card className="p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
        <FormikProvider value={formik}>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
            {/* 1. Basic Information */}
            <div className="flex flex-col gap-5">
              <h3 className="text-base font-bold text-secondary border-b border-border/80 pb-2 flex items-center gap-2">
                <AutoStoriesIcon fontSize="small" className="text-primary" />
                <span>اطلاعات پایه رویداد</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="عنوان رویداد"
                  placeholder="مثال: رویداد بازی‌سازی و کارآفرینی رکاد"
                  error={formik.touched.title && formik.errors.title}
                  {...formik.getFieldProps("title")}
                />

                <Input
                  label="نوع رویداد"
                  placeholder="مثال: مسابقه، همایش، کارگاه تخصصی"
                  error={formik.touched.type && formik.errors.type}
                  {...formik.getFieldProps("type")}
                />

                <Input
                  label="تاریخ ثبت / انتشار"
                  placeholder="مثال: 1404-07-20"
                  error={formik.touched.date && formik.errors.date}
                  {...formik.getFieldProps("date")}
                />

                <Input
                  label="تاریخ برگزاری رویداد"
                  placeholder="مثال: ۲۵ تا ۲۸ مهر ۱۴۰۴"
                  error={formik.touched.holdingDate && formik.errors.holdingDate}
                  {...formik.getFieldProps("holdingDate")}
                />

                <Input
                  label="مدت رویداد"
                  placeholder="مثال: ۳ روز (۵۴ ساعت)"
                  error={formik.touched.eventDuration && formik.errors.eventDuration}
                  {...formik.getFieldProps("eventDuration")}
                />

                <Input
                  label="محل اختتامیه"
                  placeholder="مثال: سالن همایش‌های بین‌المللی رکاد"
                  error={formik.touched.closingLocation && formik.errors.closingLocation}
                  {...formik.getFieldProps("closingLocation")}
                />
              </div>

              {/* Branch Selection */}
              <div className="flex flex-col gap-1.5 w-full text-right mt-1">
                <label className="text-xs md:text-sm font-semibold text-text-primary select-none">
                  شعبه برگزارکننده
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  {["دخترانه", "پسرانه"].map((branchOption) => {
                    const isSelected = formik.values.branch?.includes(branchOption);
                    return (
                      <Checkbox
                        key={branchOption}
                        variant="card"
                        checked={Boolean(isSelected)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const current = Array.isArray(formik.values.branch)
                            ? formik.values.branch
                            : [];
                          const updated = isChecked
                            ? [...current, branchOption]
                            : current.filter((b) => b !== branchOption);
                          formik.setFieldValue("branch", updated);
                          formik.setFieldTouched("branch", true, false);
                        }}
                        label={`شعبه ${branchOption}`}
                      />
                    );
                  })}
                </div>
                {formik.touched.branch && formik.errors.branch && (
                  <span className="text-xs text-error font-medium animate-fadeIn">
                    {typeof formik.errors.branch === "string"
                      ? formik.errors.branch
                      : formik.errors.branch[0]}
                  </span>
                )}
              </div>

              <Textarea
                label="توضیحات و معرفی رویداد"
                rows={4}
                placeholder="توضیحات جامع درباره اهداف و محورهای رویداد..."
                error={formik.touched.description && formik.errors.description}
                {...formik.getFieldProps("description")}
              />
            </div>

            {/* 2. Organizers (Mentors, Judges, Staff) - Min 3 required */}
            <div className="flex flex-col gap-4 border-t border-border/80 pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-secondary flex items-center gap-2">
                  <GroupIcon fontSize="small" className="text-primary" />
                  <span>کادر رویداد (منتور، داور، عوامل اجرایی)</span>
                </h3>
                <span className="text-xs font-semibold text-error bg-error/10 px-2.5 py-1 rounded-md">
                  حداقل ۳ نفر الزامی است
                </span>
              </div>

              <FieldArray name="organizers">
                {({ push, remove }) => (
                  <div className="flex flex-col gap-3">
                    {formik.values.organizers?.map((org, index) => {
                      const nameErr = formik.errors.organizers?.[index]?.name;
                      const roleErr = formik.errors.organizers?.[index]?.role;
                      const catErr = formik.errors.organizers?.[index]?.category;
                      const touched = formik.touched.organizers?.[index];

                      return (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-bg-light/60 p-4 rounded-xl border border-border"
                        >
                          <div className="w-full md:w-1/4">
                            <Select
                              label={index === 0 ? "دسته‌بندی" : ""}
                              options={["منتور", "عوامل اجرایی", "داور"]}
                              error={touched?.category && catErr}
                              {...formik.getFieldProps(
                                `organizers[${index}].category`
                              )}
                            />
                          </div>

                          <div className="w-full md:w-1/3">
                            <Input
                              label={index === 0 ? "نام و نام خانوادگی" : ""}
                              placeholder="مثال: مهندس حسینی"
                              error={touched?.name && nameErr}
                              {...formik.getFieldProps(
                                `organizers[${index}].name`
                              )}
                            />
                          </div>

                          <div className="w-full md:w-1/3">
                            <Input
                              label={index === 0 ? "نقش / سمت زیر نام" : ""}
                              placeholder="مثال: تسهیلگر ارشد یا داور فنی"
                              error={touched?.role && roleErr}
                              {...formik.getFieldProps(
                                `organizers[${index}].role`
                              )}
                            />
                          </div>

                          <Button
                            type="button"
                            variant="danger-ghost"
                            size="icon-sm"
                            onClick={() => remove(index)}
                            disabled={formik.values.organizers.length <= 3}
                            title={
                              formik.values.organizers.length <= 3
                                ? "حداقل ۳ عضو باید در کادر باقی بماند"
                                : "حذف این عضو"
                            }
                            className={`shrink-0 ${index === 0 ? "md:mt-5" : ""}`}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </Button>
                        </div>
                      );
                    })}

                    {formik.errors.organizers &&
                      typeof formik.errors.organizers === "string" && (
                        <span className="text-xs text-error font-semibold">
                          {formik.errors.organizers}
                        </span>
                      )}

                    <Button
                      type="button"
                      variant="primary-subtle"
                      size="sm"
                      onClick={() =>
                        push({ name: "", role: "", category: "منتور" })
                      }
                      icon={<AddIcon fontSize="small" />}
                      className="self-start mt-1"
                    >
                      افزودن عضو جدید به کادر رویداد
                    </Button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* 3. Competition Teams (First, Second, Third with Honored Toggle + Unlimited Honored Teams) */}
            <div className="flex flex-col gap-4 border-t border-border/80 pt-6">
              <h3 className="text-base font-bold text-secondary flex items-center gap-2">
                <EmojiEventsIcon fontSize="small" className="text-primary" />
                <span>تیم‌های برتر و شایسته تقدیر</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Team 1 */}
                <div className="bg-bg-light/60 p-4 rounded-xl border border-border flex flex-col gap-3">
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full self-start">
                    🥇 تیم اول (ثابت)
                  </span>
                  <Input
                    placeholder="نام تیم اول..."
                    {...formik.getFieldProps("teams.firstTeam.name")}
                  />
                  <Checkbox
                    checked={Boolean(formik.values.teams?.firstTeam?.isHonored)}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "teams.firstTeam.isHonored",
                        e.target.checked
                      )
                    }
                    label="این تیم شایسته تقدیر نیز باشد"
                  />
                </div>

                {/* Team 2 */}
                <div className="bg-bg-light/60 p-4 rounded-xl border border-border flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full self-start">
                    🥈 تیم دوم (ثابت)
                  </span>
                  <Input
                    placeholder="نام تیم دوم..."
                    {...formik.getFieldProps("teams.secondTeam.name")}
                  />
                  <Checkbox
                    checked={Boolean(formik.values.teams?.secondTeam?.isHonored)}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "teams.secondTeam.isHonored",
                        e.target.checked
                      )
                    }
                    label="این تیم شایسته تقدیر نیز باشد"
                  />
                </div>

                {/* Team 3 */}
                <div className="bg-bg-light/60 p-4 rounded-xl border border-border flex flex-col gap-3">
                  <span className="text-xs font-bold text-amber-900 bg-amber-200/60 px-2.5 py-0.5 rounded-full self-start">
                    🥉 تیم سوم (ثابت)
                  </span>
                  <Input
                    placeholder="نام تیم سوم..."
                    {...formik.getFieldProps("teams.thirdTeam.name")}
                  />
                  <Checkbox
                    checked={Boolean(formik.values.teams?.thirdTeam?.isHonored)}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "teams.thirdTeam.isHonored",
                        e.target.checked
                      )
                    }
                    label="این تیم شایسته تقدیر نیز باشد"
                  />
                </div>
              </div>

              {/* Dynamic Honored Teams */}
              <div className="mt-2 flex flex-col gap-3">
                <label className="text-xs md:text-sm font-semibold text-text-primary">
                  تیم‌های شایسته تقدیر دیگر (هر تعداد دلخواه):
                </label>

                <FieldArray name="teams.honoredTeams">
                  {({ push, remove }) => (
                    <div className="flex flex-col gap-2">
                      {formik.values.teams?.honoredTeams?.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-bg-light/40 p-2.5 rounded-lg border border-border max-w-lg"
                        >
                          <span className="text-xs font-bold text-text-muted font-numeric">
                            #{idx + 1}
                          </span>
                          <Input
                            placeholder="نام تیم شایسته تقدیر..."
                            {...formik.getFieldProps(
                              `teams.honoredTeams[${idx}].name`
                            )}
                          />
                          <Button
                            type="button"
                            variant="danger-ghost"
                            size="icon-sm"
                            onClick={() => remove(idx)}
                            title="حذف"
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="primary-subtle"
                        size="sm"
                        onClick={() => push({ name: "" })}
                        icon={<AddIcon fontSize="small" />}
                        className="self-start mt-1"
                      >
                        افزودن تیم شایسته تقدیر
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>

            {/* 4. How the Event Went (رویداد چطور گذشت) */}
            <div className="flex flex-col gap-3 border-t border-border/80 pt-6">
              <h3 className="text-base font-bold text-secondary flex items-center gap-2">
                <AutoStoriesIcon fontSize="small" className="text-primary" />
                <span>رویداد چطور گذشت (اختیاری)</span>
              </h3>
              <Textarea
                rows={4}
                placeholder="روایت و گزارش کلی از نحوه برگزاری، شور و اشتیاق شرکت‌کنندگان، چالش‌ها و دستاوردها..."
                {...formik.getFieldProps("howItWent")}
              />
            </div>

            {/* 5. Memorable Quotes (سخنان به‌یاد‌ماندنی) */}
            <div className="flex flex-col gap-3 border-t border-border/80 pt-6">
              <h3 className="text-base font-bold text-secondary flex items-center gap-2">
                <FormatQuoteIcon fontSize="small" className="text-primary" />
                <span>سخنان به‌یاد‌ماندنی رویداد (اختیاری)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <Input
                    label="متن نقل‌قول / سخن به‌یاد‌ماندنی"
                    placeholder="مثال: بزرگترین یادگیری در این رویداد، پیاده‌سازی سریع ایده‌ها بود..."
                    {...formik.getFieldProps("memorableQuote.quote")}
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    label="گوینده (چه کسی این را گفته؟)"
                    placeholder="مثال: علی رضایی (داور ارشد مسابقه)"
                    {...formik.getFieldProps("memorableQuote.speaker")}
                  />
                </div>
              </div>
            </div>

            {/* 6. Deadlines Timeline (ددلاین‌ها) */}
            <div className="flex flex-col gap-4 border-t border-border/80 pt-6">
              <h3 className="text-base font-bold text-secondary flex items-center gap-2">
                <AccessTimeIcon fontSize="small" className="text-primary" />
                <span>زمان‌بندی و ددلاین‌های رویداد</span>
              </h3>

              <Textarea
                label="توضیحات کلی ددلاین‌ها (اختیاری)"
                rows={2}
                placeholder="توضیح کلی درباره مواعد ثبت‌نام، تحویل فازهای پروژه و اعلام نتایج..."
                {...formik.getFieldProps("deadlinesDescription")}
              />

              <FieldArray name="deadlines">
                {({ push, remove }) => (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs md:text-sm font-semibold text-text-primary">
                      لیست ددلاین‌ها:
                    </label>

                    {formik.values.deadlines?.map((dl, idx) => {
                      const titleErr = formik.errors.deadlines?.[idx]?.title;
                      const touchedTitle = formik.touched.deadlines?.[idx]?.title;

                      return (
                        <div
                          key={idx}
                          className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-bg-light/60 p-4 rounded-xl border border-border"
                        >
                          <div className="w-full md:w-1/4">
                            <Input
                              placeholder="تاریخ (اختیاری) مثلاً ۱۴۰۴/۰۷/۲۲"
                              {...formik.getFieldProps(`deadlines[${idx}].date`)}
                            />
                          </div>

                          <div className="w-full md:w-1/3">
                            <Input
                              placeholder="عنوان ددلاین (اجباری)..."
                              error={touchedTitle && titleErr}
                              {...formik.getFieldProps(`deadlines[${idx}].title`)}
                            />
                          </div>

                          <div className="w-full md:w-1/3">
                            <Input
                              placeholder="توضیحات ددلاین (اختیاری)..."
                              {...formik.getFieldProps(
                                `deadlines[${idx}].description`
                              )}
                            />
                          </div>

                          <Button
                            type="button"
                            variant="danger-ghost"
                            size="icon-sm"
                            onClick={() => remove(idx)}
                            title="حذف این ددلاین"
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
                      onClick={() =>
                        push({ title: "", date: "", description: "" })
                      }
                      icon={<AddIcon fontSize="small" />}
                      className="self-start mt-1"
                    >
                      افزودن ددلاین جدید
                    </Button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* 7. Tags (تگ‌ها) */}
            <div className="flex flex-col gap-3 border-t border-border/80 pt-6">
              <label className="text-xs md:text-sm font-semibold text-text-primary select-none flex items-center gap-1.5">
                <LocalOfferIcon fontSize="small" className="text-primary" />
                <span>تگ‌های رویداد (اختیاری)</span>
              </label>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                {formik.values.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-primary/10 text-primary-active border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="hover:text-error text-text-muted transition-colors cursor-pointer"
                      title="حذف تگ"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 max-w-md">
                <Input
                  ref={tagInputRef}
                  placeholder="نام تگ جدید (مثلاً: کارگاه، رقابت)..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onBlur={() => {
                    if (newTagInput.trim()) {
                      handleAddTag();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="primary-subtle"
                  size="md"
                  onClick={handleAddTag}
                  icon={<AddIcon fontSize="small" />}
                  className="shrink-0"
                >
                  افزودن
                </Button>
              </div>

              {formik.errors.tags && (
                <span className="text-xs text-error font-medium animate-fadeIn">
                  {typeof formik.errors.tags === "string"
                    ? formik.errors.tags
                    : "تگ شامل کاراکترهای غیرمجاز است"}
                </span>
              )}
            </div>

            {/* 8. Event Poster Image */}
            <div className="border-t border-border/80 pt-6">
              <ImageUpload
                label="پوستر و تصویر رویداد"
                imagePreview={imagePreview}
                onChange={handleImageSelect}
                error={formik.touched.img && formik.errors.img}
                placeholder="برای آپلود تصویر یا پوستر رویداد کلیک کنید"
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
                {isEdit ? "ذخیره تغییرات رویداد" : "ایجاد و ثبت رویداد"}
              </Button>
            </div>
          </form>
        </FormikProvider>
      </Card>
    </div>
  );
}
