import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { Button, Input, Select, Checkbox, Textarea, PageHeader, Card } from "../../../Components/UI";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/;
const awardValidationSchema = Yup.object({
  title: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .required("عنوان جایزه الزامی است"),
  rank: Yup.number()
    .oneOf([1, 2, 3], "مقام باید 1، 2 یا 3 باشد")
    .required("تعیین مقام الزامی است"),
  description: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای خاص مجاز نیست")
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .required("نوشتن توضیحات الزامی است"),
  winners: Yup.array()
    .of(Yup.string())
    .min(1, "حداقل یک برنده باید انتخاب شود")
    .required("انتخاب برنده الزامی است"),
});

export default function CreateAward() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const data = await axiosInstance.get("student?limit=1000");
        if (data && data.success !== false) {
          setStudents(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        Notify("error", error.message || "خطا در دریافت لیست دانش‌آموزان");
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchAllStudents();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      rank: "",
      description: "",
      winners: [],
    },
    validationSchema: awardValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = {
          title: values.title,
          rank: Number(values.rank),
          description: values.description,
          winners: values.winners,
        };

        const response = await axiosInstance.post("award", payload);

        if (response && response.success !== false) {
          Notify("success", "جایزه با موفقیت ثبت شد.");
          navigate("/award");
        } else {
          Notify("error", response?.message || "ثبت جایزه با خطا مواجه شد");
        }
      } catch (error) {
        Notify("error", error.message || "ثبت جایزه با خطا مواجه شد");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="افزودن جایزه جدید"
        subtitle="ثبت افتخارات، مسابقات و برندگان دانش‌آموز"
        backTo="/award"
      />

      <Card className="p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="عنوان جایزه"
              placeholder="مثال: رتبه اول المپیاد برنامه‌نویسی"
              error={formik.touched.title && formik.errors.title}
              {...formik.getFieldProps("title")}
            />

            <Select
              label="مقام / رتبه"
              error={formik.touched.rank && formik.errors.rank}
              options={[
                { label: "مقام اول (طلا)", value: "1" },
                { label: "مقام دوم (نقره)", value: "2" },
                { label: "مقام سوم (برنز)", value: "3" },
              ]}
              {...formik.getFieldProps("rank")}
            />
          </div>

          <Textarea
            label="توضیحات"
            rows={3}
            placeholder="توضیحات مربوط به این جایزه و رویداد..."
            error={formik.touched.description && formik.errors.description}
            {...formik.getFieldProps("description")}
          />

          {/* Winners Selection Area */}
          <div className="flex flex-col gap-2 border-t border-border/80 pt-5">
            <label className="text-xs md:text-sm font-semibold text-text-primary select-none flex items-center justify-between">
              <span>انتخاب برندگان (دانش‌آموزان)</span>
              <span className="text-xs text-text-muted font-normal">
                {formik.values.winners.length} دانش‌آموز انتخاب شده
              </span>
            </label>

            <div className="border border-border rounded-xl p-3 max-h-60 overflow-y-auto bg-bg-light/50">
              {loadingStudents ? (
                <p className="text-xs text-text-muted text-center py-6">
                  در حال بارگذاری لیست دانش‌آموزان...
                </p>
              ) : students.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-6">
                  هیچ دانش‌آموزی یافت نشد.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {students.map((student) => {
                    const isSelected = formik.values.winners.includes(student._id);
                    return (
                      <Checkbox
                        key={student._id}
                        variant="card"
                        size="sm"
                        checked={isSelected}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const newWinners = isChecked
                            ? [...formik.values.winners, student._id]
                            : formik.values.winners.filter(
                                (id) => id !== student._id
                              );
                          formik.setFieldValue("winners", newWinners);
                        }}
                        label={
                          <span className="text-xs md:text-sm font-medium">
                            {student.fullName}
                            <span className="text-[11px] text-text-muted mr-1.5 font-normal">
                              (نسل {student.generation})
                            </span>
                          </span>
                        }
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {formik.touched.winners && formik.errors.winners && (
              <span className="text-xs text-error font-medium animate-fadeIn">
                {formik.errors.winners}
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
              ثبت جایزه
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}