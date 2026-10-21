// ==========================================
// Component: BlogForm
// Shared form for creating and updating blog articles with live preview tabs,
// dynamic tags, table of contents builder, and rich HTML editor
// ==========================================

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";

import {
  Button,
  Input,
  Textarea,
  PageHeader,
  Card,
  ImageUpload,
  Tabs,
  FormActionBar,
} from "../../../Components/UI";
import HtmlEditor from "./HtmlEditor";
import BlogPreview from "./BlogPreview";
import { slugify } from "../../../Utils/slugify";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-_،؛؟!.:«»",;?()/\u200c\u200d]+$/u;

const blogValidationSchema = Yup.object({
  title: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .max(200, "عنوان حداکثر ۲۰۰ کاراکتر است")
    .required("وارد کردن عنوان مقاله الزامی است"),
  slug: Yup.string()
    .max(150, "اسلاگ حداکثر می‌تواند ۱۵۰ کاراکتر باشد")
    .test(
      "slug-format",
      "اسلاگ فقط می‌تواند شامل حروف، اعداد و خط تیره (-) باشد و نباید با خط تیره شروع یا پایان یابد",
      (val) => !val || !val.trim() || /^[a-z0-9\u0600-\u06FF]+(?:-[a-z0-9\u0600-\u06FF]+)*$/.test(val)
    )
    .optional(),
  date: Yup.string()
    .matches(safeTextRegex, "مقدار غیرمجاز")
    .required("انتخاب تاریخ انتشار الزامی است"),
  description: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .max(2000, "توضیحات حداکثر ۲۰۰۰ کاراکتر است")
    .required("وارد کردن توضیحات و چکیده الزامی است"),
  img: Yup.mixed().required("انتخاب تصویر شاخص الزامی است"),
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
  tableOfContents: Yup.array().of(
    Yup.object({
      title: Yup.string()
        .max(200, "عنوان سرفصل حداکثر ۲۰۰ کاراکتر است")
        .test("safe-text", "عنوان سرفصل شامل کاراکتر غیرمجاز است", (val) => {
          if (!val || !val.trim()) return true;
          return safeTextRegex.test(val);
        }),
    })
  ),
  htmlContent: Yup.string().max(200000, "محتوا بیش از حد مجاز است"),
});

const defaultInitialValues = {
  title: "",
  slug: "",
  date: "",
  description: "",
  img: null,
  tags: [],
  tableOfContents: [],
  htmlContent: "",
};

export default function BlogForm({
  initialValues = defaultInitialValues,
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  existingImageUrl = null,
  pageTitle = "افزودن بلاگ جدید",
  pageSubtitle = "نگارش مقاله و انتشار در بخش مقالات و وبلاگ",
}) {
  const [activeTab, setActiveTab] = useState("edit");
  const [imagePreview, setImagePreview] = useState(existingImageUrl || null);
  const [newTagInput, setNewTagInput] = useState("");
  const [userModifiedSlug, setUserModifiedSlug] = useState(Boolean(initialValues?.slug));
  const tagInputRef = useRef(null);

  const normalizedInitialValues = useMemo(() => {
    const raw = initialValues || defaultInitialValues;
    return {
      ...defaultInitialValues,
      ...raw,
      slug: raw.slug || "",
      tags: Array.isArray(raw.tags) ? raw.tags : [],
      tableOfContents: Array.isArray(raw.tableOfContents)
        ? raw.tableOfContents.map((item) =>
            typeof item === "string"
              ? { title: item }
              : { title: item?.title || "" }
          )
        : [],
    };
  }, [initialValues]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: normalizedInitialValues,
    validationSchema: blogValidationSchema,
    onSubmit: async (values) => {
      let currentTags = Array.isArray(values.tags) ? [...values.tags] : [];
      if (newTagInput.trim()) {
        const extraTags = newTagInput
          .trim()
          .split(/[،,]/)
          .map((t) => t.trim().replace(/^#+/, ""))
          .filter((t) => t && !currentTags.includes(t));
        currentTags = [...currentTags, ...extraTags];
      }

      const cleanedToc = (values.tableOfContents || [])
        .map((item) =>
          typeof item === "string"
            ? { title: item.trim() }
            : { title: (item?.title || "").trim() }
        )
        .filter((item) => item.title.length > 0);

      const finalSlug = values.slug?.trim() ? slugify(values.slug) : slugify(values.title);

      await onSubmit({
        ...values,
        slug: finalSlug,
        tags: currentTags,
        tableOfContents: cleanedToc,
      });
      setNewTagInput("");
    },
  });

  useEffect(() => {
    if (initialValues?.slug) {
      setUserModifiedSlug(true);
    }
  }, [initialValues?.slug]);

  useEffect(() => {
    if (!(formik.values.img instanceof File)) {
      setImagePreview(existingImageUrl || null);
    }
  }, [existingImageUrl]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    formik.setFieldValue("title", newTitle);
    if (!userModifiedSlug) {
      formik.setFieldValue("slug", slugify(newTitle));
    }
  };

  const handleSlugChange = (e) => {
    setUserModifiedSlug(true);
    const sanitized = e.target.value
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
      .replace(/-+/g, "-");
    formik.setFieldValue("slug", sanitized);
  };

  const handleSlugBlur = (e) => {
    formik.handleBlur(e);
    if (formik.values.slug) {
      formik.setFieldValue("slug", slugify(formik.values.slug));
    }
  };

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

    const currentTags = Array.isArray(formik.values.tags)
      ? [...formik.values.tags]
      : [];

    parsedTags.forEach((t) => {
      if (!currentTags.includes(t)) {
        currentTags.push(t);
      }
    });

    formik.setFieldValue("tags", currentTags);
    setNewTagInput("");
  };

  const handleRemoveTag = (indexToRemove) => {
    const currentTags = Array.isArray(formik.values.tags)
      ? formik.values.tags
      : [];
    formik.setFieldValue(
      "tags",
      currentTags.filter((_, idx) => idx !== indexToRemove)
    );
  };

  const handleAddTableOfContent = () => {
    const current = Array.isArray(formik.values.tableOfContents)
      ? [...formik.values.tableOfContents]
      : [];
    formik.setFieldValue("tableOfContents", [...current, { title: "" }]);
  };

  const handleRemoveTableOfContent = (indexToRemove) => {
    const current = Array.isArray(formik.values.tableOfContents)
      ? [...formik.values.tableOfContents]
      : [];
    formik.setFieldValue(
      "tableOfContents",
      current.filter((_, idx) => idx !== indexToRemove)
    );
  };

  const handleTocTitleChange = (index, newTitle) => {
    const current = Array.isArray(formik.values.tableOfContents)
      ? [...formik.values.tableOfContents]
      : [];
    const item = current[index];
    const updated =
      typeof item === "object" && item !== null
        ? { ...item, title: newTitle }
        : { title: newTitle };
    current[index] = updated;
    formik.setFieldValue("tableOfContents", current);
  };

  const handleFormSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (newTagInput.trim()) {
      const extraTags = newTagInput
        .trim()
        .split(/[،,]/)
        .map((t) => t.trim().replace(/^#+/, ""))
        .filter((t) => t.length > 0);

      const currentTags = Array.isArray(formik.values.tags)
        ? [...formik.values.tags]
        : [];

      extraTags.forEach((t) => {
        if (!currentTags.includes(t)) {
          currentTags.push(t);
        }
      });

      formik.setFieldValue("tags", currentTags);
      setNewTagInput("");
    }

    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      if (activeTab === "preview") {
        setActiveTab("edit");
      }
      formik.setTouched({
        title: true,
        slug: true,
        date: true,
        description: true,
        img: true,
        htmlContent: true,
        tags: true,
      });
      return;
    }

    formik.handleSubmit(e);
  };

  const blogTabs = [
    {
      id: "edit",
      label: "ویرایش و نگارش مقاله",
      icon: <EditNoteIcon fontSize="small" />,
    },
    {
      id: "preview",
      label: "پیش‌نمایش زنده مقاله",
      icon: <VisibilityIcon fontSize="small" />,
    },
  ];

  return (
    <div dir="rtl" className="p-4 sm:p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title={pageTitle}
        subtitle={pageSubtitle}
        backTo="/blog"
      />

      <div className="max-w-4xl mx-auto mb-6">
        <Tabs
          tabs={blogTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <FormikProvider value={formik}>
        <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto flex flex-col gap-6 pb-20 md:pb-6">
          <div className={activeTab === "preview" ? "block" : "hidden"}>
            <BlogPreview
              title={formik.values.title}
              date={formik.values.date}
              description={formik.values.description}
              img={formik.values.img}
              imagePreview={imagePreview}
              tags={formik.values.tags}
              tableOfContents={formik.values.tableOfContents}
              htmlContent={formik.values.htmlContent}
            />

            <div className="mt-6">
              <FormActionBar
                submitLabel={isEdit ? "ذخیره تغییرات مقاله" : "ثبت و انتشار مقاله"}
                isSubmitting={isSubmitting}
                secondaryAction={
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setActiveTab("edit")}
                    icon={<EditNoteIcon fontSize="small" />}
                    className="w-full md:w-auto text-xs md:text-sm font-semibold min-h-[44px]"
                  >
                    بازگشت به ویرایش
                  </Button>
                }
              />
            </div>
          </div>

          <div className={activeTab === "edit" ? "block" : "hidden"}>
            <Card className="p-6 md:p-8 shadow-sm">
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="عنوان مقاله"
                    placeholder="مثال: معرفی جامع معماری فرانت‌اند و فریمورک‌ها"
                    error={formik.touched.title && formik.errors.title}
                    name="title"
                    value={formik.values.title}
                    onChange={handleTitleChange}
                    onBlur={formik.handleBlur}
                  />

                  <Input
                    label="اسلاگ / شناسه یکتای مقاله در URL (Slug)"
                    placeholder="rokad-frontend-architecture-guide"
                    helperText={
                      formik.values.slug ? (
                        <span className="flex items-center gap-1.5 flex-wrap break-all text-xs text-text-muted">
                          <span>آدرس URL صفحه:</span>
                          <span
                            dir="ltr"
                            className="font-mono text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded text-[11px] break-all max-w-full"
                          >
                            /blog/{formik.values.slug.length > 55 ? `${formik.values.slug.slice(0, 55)}...` : formik.values.slug}
                          </span>
                        </span>
                      ) : (
                        "در صورت خالی گذاشتن، اسلاگ به صورت خودکار از عنوان مقاله تولید می‌شود."
                      )
                    }
                    error={formik.touched.slug && formik.errors.slug}
                    name="slug"
                    value={formik.values.slug}
                    onChange={handleSlugChange}
                    onBlur={handleSlugBlur}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="تاریخ انتشار"
                    placeholder="مثال: 1404-06-15"
                    error={formik.touched.date && formik.errors.date}
                    {...formik.getFieldProps("date")}
                  />
                </div>

                <Textarea
                  label="چکیده و توضیحات مقاله"
                  rows={4}
                  placeholder="توضیحات کوتاه و چکیده مقاله جهت نمایش در کارت‌ها و لید مقاله..."
                  error={formik.touched.description && formik.errors.description}
                  {...formik.getFieldProps("description")}
                />

                <div className="flex flex-col gap-3 border-t border-border/80 pt-5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs md:text-sm font-semibold text-text-primary select-none flex items-center gap-1.5">
                      <LocalOfferIcon fontSize="small" className="text-primary" />
                      <span>تگ‌ها و کلمات کلیدی (اختیاری)</span>
                    </label>
                    <span className="text-[11px] text-text-muted">
                      می‌توانید تگ‌ها را با کاما (،) یا کلید اینتر تفکیک کنید
                    </span>
                  </div>

                  {Array.isArray(formik.values.tags) && formik.values.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {formik.values.tags.map((tag, idx) => (
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
                  )}

                  <div className="flex items-center gap-2 max-w-md">
                    <Input
                      ref={tagInputRef}
                      placeholder="نام تگ جدید (مثلاً: برنامه‌نویسی، آموزش)..."
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

                <div className="flex flex-col gap-3 border-t border-border/80 pt-5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs md:text-sm font-semibold text-text-primary select-none flex items-center gap-1.5">
                      <FormatListNumberedRtlIcon
                        fontSize="small"
                        className="text-primary"
                      />
                      <span>فهرست مطالب مقاله (اختیاری)</span>
                    </label>
                    <span className="text-[11px] text-text-muted">
                      شماره‌گذاری سرفصل‌ها به صورت خودکار اعمال می‌شود
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {Array.isArray(formik.values.tableOfContents) &&
                      formik.values.tableOfContents.map((item, index) => {
                        const val =
                          typeof item === "object" && item !== null
                            ? item.title || ""
                            : item || "";
                        const errorMsg =
                          formik.errors.tableOfContents?.[index]?.title;

                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 bg-bg-light/60 p-3 rounded-xl border border-border"
                          >
                            <span className="w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center font-numeric shrink-0">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <Input
                                placeholder={`عنوان سرفصل ${index + 1}...`}
                                value={val}
                                onChange={(e) =>
                                  handleTocTitleChange(index, e.target.value)
                                }
                                error={errorMsg}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="danger-ghost"
                              size="icon-sm"
                              onClick={() => handleRemoveTableOfContent(index)}
                              title="حذف این سرفصل"
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
                      onClick={handleAddTableOfContent}
                      icon={<AddIcon fontSize="small" />}
                      className="self-start mt-1"
                    >
                      افزودن سرفصل جدید به فهرست مطالب
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border/80 pt-5">
                  <HtmlEditor
                    name="htmlContent"
                    label="محتوای متنی و کدهای HTML مقاله"
                    value={formik.values.htmlContent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.htmlContent && formik.errors.htmlContent
                    }
                  />
                </div>

                <div className="border-t border-border/80 pt-5">
                  <ImageUpload
                    label="تصویر شاخص مقاله"
                    imagePreview={imagePreview}
                    onChange={handleImageSelect}
                    error={formik.touched.img && formik.errors.img}
                    placeholder="برای آپلود تصویر شاخص مقاله کلیک کنید"
                  />
                </div>

                <div className="pt-4 border-t border-border/80">
                  <FormActionBar
                    submitLabel={isEdit ? "ذخیره تغییرات مقاله" : "ثبت و انتشار مقاله"}
                    isSubmitting={isSubmitting}
                    secondaryAction={
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={() => setActiveTab("preview")}
                        icon={<VisibilityIcon fontSize="small" />}
                        className="w-full md:w-auto text-xs md:text-sm font-semibold min-h-[44px]"
                      >
                        پیش‌نمایش قبل از انتشار
                      </Button>
                    }
                  />
                </div>
              </div>
            </Card>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
}