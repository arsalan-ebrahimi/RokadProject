// ==========================================
// Dependencies & Libraries
// ==========================================
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate, useParams } from "react-router-dom";

// ==========================================
// Utilities & Components
// ==========================================
import fetchData from "../../../Utils/fetchData";
import Notify from "../../../Utils/notify";
import Loading from "../../../Components/Loading";

// ----------------------------------------
// Validation Schema
// ----------------------------------------
const awardUpdateSchema = Yup.object({
  title: Yup.string().required("عنوان جایزه الزامی است"),
  rank: Yup.number()
    .oneOf([1, 2, 3], "مقام باید 1، 2 یا 3 باشد")
    .required("تعیین مقام الزامی است"),
  description: Yup.string().required("نوشتن توضیحات الزامی است"),
  winners: Yup.array()
    .of(Yup.string())
    .min(1, "حداقل یک برنده باید انتخاب شود")
    .required("انتخاب برنده الزامی است"),
});

// ==========================================
// Component: UpdateAward
// ==========================================
export default function UpdateAward() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [initialValues, setInitialValues] = useState({
    title: "",
    rank: "",
    description: "",
    winners: [],
  });

  // ----------------------------------------
  // Fetch Students & Award Data
  // ----------------------------------------
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      
      // 1. واکشی لیست تمام دانش‌آموزان
      const studentRes = await fetchData("student?limit=1000");
      if (studentRes && studentRes.success !== false) {
        setStudents(Array.isArray(studentRes) ? studentRes : studentRes.data || []);
      }
      setLoadingStudents(false);

      // 2. واکشی اطلاعات جایزه
      const response = await fetchData(`award/${id}`);
      
      let awardData = null;
      if (response && response.data) {
        awardData = Array.isArray(response.data) ? response.data[0] : response.data;
      } else if (Array.isArray(response)) {
        awardData = response[0];
      }

      if (awardData) {
        // اگر winners از سمت بک‌اند Populate شده باشد، باید فقط id آن‌ها را جدا کنیم
        const winnerIds = awardData.winners 
            ? awardData.winners.map(w => w._id || w) 
            : [];

        setInitialValues({
          title: awardData.title || "",
          rank: awardData.rank || "",
          description: awardData.description || "",
          winners: winnerIds,
        });
      }
      
      setLoading(false);
    };

    if (id) getData();
  }, [id]);

  // ----------------------------------------
  // Formik Configuration
  // ----------------------------------------
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: awardUpdateSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      const payload = {
        title: values.title,
        rank: Number(values.rank),
        description: values.description,
        winners: values.winners,
      };

      const response = await fetchData(`award/${id}`, {
        method: "PATCH", 
        body: JSON.stringify(payload),
      });

      if (response && (response.success || response.status === "success")) {
        Notify("success", "جایزه با موفقیت ویرایش شد!");
        navigate("/award");
      } else {
        Notify("error", response?.message || "ویرایش با خطا مواجه شد");
      }

      setIsSubmitting(false);
    },
  });

  const inputClass = (error) =>
    `w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${
      error ? "border-red-500" : "border-gray-300 focus:border-[#51b5a5]"
    }`;

  // ----------------------------------------
  // Render Component
  // ----------------------------------------
  if (loading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loading size={12} />
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#1b234d]">ویرایش جایزه</h1>
        <button
          type="button"
          onClick={() => navigate("/award")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#1b234d] transition-colors font-medium"
        >
          <span>بازگشت</span>
          <ArrowForwardIcon fontSize="small" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-4xl mx-auto">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">عنوان جایزه</label>
              <input
                type="text"
                {...formik.getFieldProps("title")}
                className={inputClass(formik.touched.title && formik.errors.title)}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.title}</div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">مقام / رتبه</label>
              <select
                {...formik.getFieldProps("rank")}
                className={`bg-white ${inputClass(formik.touched.rank && formik.errors.rank)}`}
              >
                <option value="">انتخاب کنید</option>
                <option value="1">مقام اول</option>
                <option value="2">مقام دوم</option>
                <option value="3">مقام سوم</option>
              </select>
              {formik.touched.rank && formik.errors.rank && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.rank}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">توضیحات</label>
            <textarea
              rows="3"
              {...formik.getFieldProps("description")}
              className={`resize-y ${inputClass(formik.touched.description && formik.errors.description)}`}
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t pt-4">
            <label className="text-sm font-semibold text-gray-700">انتخاب برندگان (دانش‌آموزان)</label>
            <div className="border border-gray-300 rounded-lg p-3 max-h-60 overflow-y-auto bg-gray-50">
              {loadingStudents ? (
                <p className="text-sm text-gray-500 text-center py-4">در حال بارگذاری لیست دانش‌آموزان...</p>
              ) : students.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">هیچ دانش‌آموزی یافت نشد.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {students.map((student) => (
                    <label key={student._id} className="flex items-center gap-3 p-2 bg-white rounded border border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        value={student._id}
                        checked={formik.values.winners.includes(student._id)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const newWinners = isChecked
                            ? [...formik.values.winners, student._id]
                            : formik.values.winners.filter((id) => id !== student._id);
                          formik.setFieldValue("winners", newWinners);
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {student.fullName} <span className="text-xs text-gray-400">(نسل {student.generation})</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {formik.touched.winners && formik.errors.winners && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.winners}</div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-white px-8 py-3 rounded-lg font-medium transition-colors active:scale-95 min-w-[150px] flex justify-center items-center ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? <Loading color="#ffffff" size={8} /> : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}