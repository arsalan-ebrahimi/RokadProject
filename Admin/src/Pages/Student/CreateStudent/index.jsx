// ==========================================
// Dependencies & Libraries
// ==========================================
import React, { useState } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// ==========================================
// Utilities
// ==========================================
import fetchData from "../../../Utils/fetchData";
import Notify from "../../../Utils/notify";
import Loading from "../../../Components/Loading";

// ----------------------------------------
// Validation Schema
// ----------------------------------------
const studentValidationSchema = Yup.object({
  fullName: Yup.string().required("وارد کردن نام کامل الزامی است"),
  job: Yup.string().required("وارد کردن شغل الزامی است"),
  generation: Yup.number().typeError("نسل باید عدد باشد").required("تعیین نسل الزامی است"),
  img: Yup.mixed().required("انتخاب تصویر دانش‌آموز الزامی است"),
  socialLinks: Yup.array().of(
    Yup.object({
      type: Yup.string().required("نوع شبکه الزامی است"),
      link: Yup.string().required("لینک الزامی است"),
    })
  ),
});

// ==========================================
// Component: CreateStudent
// ==========================================
export default function CreateStudent() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      job: "",
      generation: "",
      img: null,
      socialLinks: [],
    },
    validationSchema: studentValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("file", values.img);

        const uploadData = await fetchData("upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadData || !uploadData.success) {
          throw new Error(uploadData?.message || "آپلود تصویر با خطا مواجه شد");
        }

        const uploadedFilename = uploadData.data;

        const payload = {
          fullName: values.fullName,
          job: values.job,
          generation: Number(values.generation),
          img: uploadedFilename,
          socialLinks: values.socialLinks,
        };

        const response = await fetchData("student", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response && response.success !== false) {
          Notify("success", "دانش‌آموز با موفقیت ثبت شد!");
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

  // Security Protection for Default Files
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.name.toLowerCase().startsWith("default-")) {
        Notify("error", "نام فایل مجاز نیست. لطفاً نام فایل را تغییر دهید.");
        e.target.value = ""; 
        return;
      }
      formik.setFieldValue("img", file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const inputClass = (error) =>
    `w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${
      error ? "border-red-500" : "border-gray-300 focus:border-[#51b5a5]"
    }`;

  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#1b234d]">افزودن دانش‌آموز جدید</h1>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-[#1b234d] transition-colors font-medium"
        >
          <span>بازگشت</span>
          <ArrowForwardIcon fontSize="small" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-4xl mx-auto">
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">نام کامل</label>
                <input
                  type="text"
                  placeholder="مثال: محمد رضایی"
                  {...formik.getFieldProps("fullName")}
                  className={inputClass(formik.touched.fullName && formik.errors.fullName)}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.fullName}</div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">شغل فعلی</label>
                <input
                  type="text"
                  placeholder="مثال: برنامه‌نویس فرانت‌اند"
                  {...formik.getFieldProps("job")}
                  className={inputClass(formik.touched.job && formik.errors.job)}
                />
                {formik.touched.job && formik.errors.job && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.job}</div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">نسل (عدد)</label>
                <input
                  type="number"
                  placeholder="مثال: 3"
                  {...formik.getFieldProps("generation")}
                  className={inputClass(formik.touched.generation && formik.errors.generation)}
                />
                {formik.touched.generation && formik.errors.generation && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.generation}</div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t pt-4">
              <label className="text-sm font-semibold text-gray-700">شبکه‌های اجتماعی</label>
              <FieldArray name="socialLinks">
                {({ push, remove }) => (
                  <div className="flex flex-col gap-4">
                    {formik.values.socialLinks.map((social, index) => {
                      const typeError = formik.errors.socialLinks?.[index]?.type;
                      const linkError = formik.errors.socialLinks?.[index]?.link;
                      const touchedType = formik.touched.socialLinks?.[index]?.type;
                      const touchedLink = formik.touched.socialLinks?.[index]?.link;

                      return (
                        <div key={index} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="w-full md:w-1/3 flex flex-col gap-1">
                            <input
                              placeholder="نوع (مثال: Github)"
                              {...formik.getFieldProps(`socialLinks[${index}].type`)}
                              className={inputClass(touchedType && typeError)}
                            />
                            {touchedType && typeError && <span className="text-red-500 text-xs">{typeError}</span>}
                          </div>
                          
                          <div className="w-full flex flex-col gap-1">
                            <input
                              dir="ltr"
                              placeholder="https://..."
                              {...formik.getFieldProps(`socialLinks[${index}].link`)}
                              className={inputClass(touchedLink && linkError)}
                            />
                            {touchedLink && linkError && <span className="text-red-500 text-xs">{linkError}</span>}
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2.5 text-red-500 bg-red-100 hover:bg-red-200 rounded-lg transition-colors mt-1 md:mt-0"
                            title="حذف این لینک"
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </button>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => push({ type: "", link: "" })}
                      className="self-start flex items-center gap-2 text-[#51b5a5] bg-teal-50 px-4 py-2 rounded-lg font-medium hover:bg-teal-100 transition-colors"
                    >
                      <AddIcon fontSize="small" />
                      افزودن لینک جدید
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="flex flex-col gap-2 border-t pt-4">
              <label className="text-sm font-semibold text-gray-700">تصویر دانش‌آموز</label>
              <div className="w-full md:w-1/2 h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden">
                <input
                  id="img"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <CloudUploadIcon className="text-gray-400" fontSize="large" />
                    <p className="text-sm font-medium text-gray-600">برای آپلود تصویر کلیک کنید</p>
                  </>
                )}
              </div>
              {formik.touched.img && formik.errors.img && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.img}</div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`text-white px-8 py-3 rounded-lg font-medium transition-colors active:scale-95 min-w-[150px] flex justify-center items-center ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#51b5a5] hover:bg-teal-600"
                }`}
              >
                {isSubmitting ? <Loading color="#ffffff" size={8} /> : "ثبت دانش‌آموز"}
              </button>
            </div>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}