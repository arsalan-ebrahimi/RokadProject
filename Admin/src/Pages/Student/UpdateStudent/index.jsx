import React, { useState, useEffect } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import Loading from "../../../Components/Loading";
import { Button, Input, Select, PageHeader, Card, ImageUpload } from "../../../Components/UI";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?]+$/;
const studentUpdateSchema = Yup.object({
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
  socialLinks: Yup.array().of(
    Yup.object({
      type: Yup.string()
        .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
        .required("نوع شبکه الزامی است"),
      link: Yup.string().required("لینک الزامی است"),
    })
  ),
});

export default function UpdateStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    fullName: "",
    job: "",
    generation: "",
    schoolType: "",
    major: "",
    img: null,
    socialLinks: [],
  });

  useEffect(() => {
    const getStudentData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`student/${id}`);

        let rawData = response?.data?.data || response?.data || response;
        let data = Array.isArray(rawData) ? rawData[0] : rawData;

        if (data && data._id) {
          setInitialValues({
            fullName: data.fullName || "",
            job: data.job || "",
            generation: data.generation || "",
            schoolType: data.schoolType || "",
            major: data.major || "",
            img: data.img || null,
            socialLinks: data.socialLinks || [],
          });

          if (data.img) {
            setImagePreview(getImageUrl(data.img));
          }
        } else {
          Notify("error", "اطلاعات دانش‌آموز یافت نشد.");
        }
      } catch (error) {
        console.error("Fetch Student Error:", error);
        Notify("error", error.message || "خطا در ارتباط با سرور");
      }

      setLoading(false);
    };

    if (id) getStudentData();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: studentUpdateSchema,
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
          fullName: values.fullName,
          job: values.job,
          generation: Number(values.generation),
          schoolType: values.schoolType,
          major: values.major,
          img: finalImageName,
          socialLinks: values.socialLinks,
        };

        const response = await axiosInstance.patch(`student/${id}`, payload);

        if (response && (response.success || response.status === "success")) {
          Notify("success", "اطلاعات دانش‌آموز با موفقیت ویرایش شد.");
          navigate("/student");
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
        title="ویرایش اطلاعات دانش‌آموز"
        subtitle="ویرایش جزئیات، رزومه و تصویر دانش‌آموز"
        backTo="/student"
      />

      <Card className="p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="نام کامل"
                error={formik.touched.fullName && formik.errors.fullName}
                {...formik.getFieldProps("fullName")}
              />

              <Input
                label="شغل فعلی"
                error={formik.touched.job && formik.errors.job}
                {...formik.getFieldProps("job")}
              />

              <Input
                type="number"
                label="نسل"
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
                              placeholder="نوع (مثال: Github)"
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
                      افزودن لینک
                    </Button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Image Upload */}
            <div className="border-t border-border/80 pt-5">
              <ImageUpload
                label="تغییر تصویر دانش‌آموز"
                imagePreview={imagePreview}
                onChange={handleImageSelect}
                error={formik.touched.img && formik.errors.img}
                placeholder="برای تغییر تصویر کلیک کنید"
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
                ذخیره تغییرات
              </Button>
            </div>
          </form>
        </FormikProvider>
      </Card>
    </div>
  );
}