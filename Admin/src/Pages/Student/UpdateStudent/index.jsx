// ==========================================
// Dependencies & Libraries
// ==========================================
import React, { useState, useEffect } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate, useParams } from "react-router-dom";

// ==========================================
// Utilities
// ==========================================
import fetchData from "../../../Utils/fetchData";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";

// ----------------------------------------
// Validation Schema for Formik
// ----------------------------------------
const studentUpdateSchema = Yup.object({
  fullName: Yup.string().required("وارد کردن نام کامل الزامی است"),
  job: Yup.string().required("وارد کردن شغل الزامی است"),
  generation: Yup.number().typeError("نسل باید عدد باشد").required("تعیین نسل الزامی است"),
  socialLinks: Yup.array().of(
    Yup.object({
      type: Yup.string().required("نوع شبکه الزامی است"),
      link: Yup.string().required("لینک الزامی است"),
    })
  ),
});

// ==========================================
// Component: UpdateStudent
// Description: Form to update existing student data with dynamic social links
// ==========================================
export default function UpdateStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial values state
  const [initialValues, setInitialValues] = useState({
    fullName: "",
    job: "",
    generation: "",
    img: null,
    socialLinks: [],
  });

  // ----------------------------------------
  // Fetch Existing Data on Mount
  // ----------------------------------------
  useEffect(() => {
    const getStudentData = async () => {
      setLoading(true);
      const response = await fetchData(`student/${id}`);
      
      let data = null;
      if (response && response.data) {
        data = Array.isArray(response.data) ? response.data[0] : response.data;
      } else if (Array.isArray(response)) {
        data = response[0];
      }

      if (data) {
        setInitialValues({
          fullName: data.fullName || "",
          job: data.job || "",
          generation: data.generation || "",
          img: data.img || null,
          socialLinks: data.socialLinks || [],
        });

        if (data.img) setImagePreview(getImageUrl(data.img));
      }
      
      setLoading(false);
    };

    if (id) getStudentData();
  }, [id]);

  // ----------------------------------------
  // Formik Setup
  // ----------------------------------------
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: studentUpdateSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let finalImageName = values.img;

        // Check if a new file is uploaded
        if (values.img instanceof File) {
          const formData = new FormData();
          formData.append("file", values.img);

          const uploadData = await fetchData("upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadData || !uploadData.success) {
            throw new Error(uploadData?.message || "آپلود تصویر با خطا مواجه شد");
          }
          finalImageName = uploadData.data;
        }

        const payload = {
          fullName: values.fullName,
          job: values.job,
          generation: Number(values.generation),
          img: finalImageName,
          socialLinks: values.socialLinks,
        };

        const response = await fetchData(`student/${id}`, {
          method: "PATCH", 
          body: JSON.stringify(payload),
        });

        if (response && (response.success || response.status === "success")) {
          Notify("success", "دانش‌آموز با موفقیت ویرایش شد!");
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("img", file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const inputClass = (error) =>
    `w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${
      error ? "border-red-500" : "border-gray-300 focus:border-[#51b5a5]"
    }`;

  if (loading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">در حال بارگذاری اطلاعات...</p>
      </div>
    );
  }

  // ----------------------------------------
  // Render Component
  // ----------------------------------------
  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#1b234d]">ویرایش اطلاعات دانش‌آموز</h1>
        <button
          type="button"
          onClick={() => navigate("/student")}
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
                  {...formik.getFieldProps("fullName")}
                  className={inputClass(formik.touched.fullName && formik.errors.fullName)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">شغل فعلی</label>
                <input
                  type="text"
                  {...formik.getFieldProps("job")}
                  className={inputClass(formik.touched.job && formik.errors.job)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">نسل</label>
                <input
                  type="number"
                  {...formik.getFieldProps("generation")}
                  className={inputClass(formik.touched.generation && formik.errors.generation)}
                />
              </div>
            </div>

            {/* Dynamic Social Links Section */}
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
                          
                          <div className="w-full md:w-full flex flex-col gap-1">
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
                      className="self-start flex items-center gap-2 text-blue-500 bg-blue-50 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                    >
                      <AddIcon fontSize="small" />
                      افزودن لینک
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Image Upload Area */}
            <div className="flex flex-col gap-2 border-t pt-4">
              <label className="text-sm font-semibold text-gray-700">تغییر تصویر دانش‌آموز</label>
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
                    <p className="text-sm font-medium text-gray-600">برای تغییر تصویر کلیک کنید</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`text-white px-8 py-3 rounded-lg font-medium transition-colors active:scale-95 ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}