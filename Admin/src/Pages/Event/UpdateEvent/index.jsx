import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import Loading from "../../../Components/Loading";
import { Button, Input, Checkbox, Textarea, PageHeader, Card, ImageUpload } from "../../../Components/UI";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?]+$/;
const eventUpdateSchema = Yup.object({
  title: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
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
    .of(Yup.string().oneOf(["دخترانه", "پسرانه"], "شعبه نامعتبر است"))
    .min(1, "حداقل یک شعبه را انتخاب کنید")
    .required("مشخص کردن شعبه الزامی است"),
});

export default function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    title: "",
    type: "",
    date: "",
    description: "",
    branch: [],
    img: null,
  });

  useEffect(() => {
    const getEventData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`event/${id}`);

        let data = null;
        if (response && response.data) {
          data = Array.isArray(response.data) ? response.data[0] : response.data;
        } else if (Array.isArray(response)) {
          data = response[0];
        }

        if (data) {
          let branchData = [];
          if (Array.isArray(data.branch)) {
            branchData = data.branch;
          } else if (typeof data.branch === "string" && data.branch) {
            branchData = [data.branch];
          }

          setInitialValues({
            title: data.title || "",
            type: data.type || "",
            date: data.date || "",
            description: data.description || "",
            branch: branchData,
            img: data.img || null,
          });

          if (data.img) setImagePreview(getImageUrl(data.img));
        }
      } catch (error) {
        Notify("error", error.message || "خطا در دریافت اطلاعات رویداد");
      }

      setLoading(false);
    };

    if (id) getEventData();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: eventUpdateSchema,
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
          title: values.title,
          type: values.type,
          date: values.date,
          description: values.description,
          branch: values.branch,
          img: finalImageName,
        };

        const response = await axiosInstance.patch(`event/${id}`, payload);

        if (response && (response.success || response.status === "success")) {
          Notify("success", "رویداد با موفقیت ویرایش شد.");
          navigate("/event");
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
        title="ویرایش رویداد"
        subtitle="ویرایش جزئیات و تصویر رویداد"
        backTo="/event"
      />

      <Card className="p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="عنوان رویداد"
              error={formik.touched.title && formik.errors.title}
              {...formik.getFieldProps("title")}
            />

            <Input
              label="نوع رویداد"
              error={formik.touched.type && formik.errors.type}
              {...formik.getFieldProps("type")}
            />

            <Input
              label="تاریخ رویداد"
              error={formik.touched.date && formik.errors.date}
              {...formik.getFieldProps("date")}
            />

            <div className="flex flex-col gap-1.5 w-full text-right">
              <label className="text-xs md:text-sm font-semibold text-text-primary select-none">
                شعبه
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["دخترانه", "پسرانه"].map((branchOption) => {
                  const isSelected = formik.values.branch?.includes(branchOption);
                  return (
                    <Checkbox
                      key={branchOption}
                      variant="card"
                      checked={isSelected}
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
                    : formik.errors.branch[0] || "حداقل یک شعبه را انتخاب کنید"}
                </span>
              )}
            </div>
          </div>

          <Textarea
            label="توضیحات"
            rows={5}
            error={formik.touched.description && formik.errors.description}
            {...formik.getFieldProps("description")}
          />

          <div className="border-t border-border/80 pt-5">
            <ImageUpload
              label="تغییر تصویر رویداد"
              imagePreview={imagePreview}
              onChange={handleImageSelect}
              error={formik.touched.img && formik.errors.img}
              placeholder="برای تغییر تصویر رویداد کلیک کنید"
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