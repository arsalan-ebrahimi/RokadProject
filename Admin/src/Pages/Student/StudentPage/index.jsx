// ==========================================
// Dependencies & Icons
// ==========================================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

// ==========================================
// Utilities & Components
// ==========================================
import fetchData from "../../../Utils/fetchData"; 
import StudentCard from "../StudentCard"; 
import Notify from "../../../Utils/notify";
import Confirm from "../../../Utils/Confirm"; // Custom SweetAlert2

// ==========================================
// Component: StudentPage
// Description: Manages and displays the list of students
// ==========================================
export default function StudentPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------
  // Fetch Students Data on Mount
  // ----------------------------------------
  useEffect(() => {
    const getStudents = async () => {
      setLoading(true);
      const data = await fetchData("student");
      
      if (data && data.success !== false) {
        setStudents(Array.isArray(data) ? data : data.data || []);
      } else {
        console.error("Failed to fetch students:", data?.message);
      }
      setLoading(false);
    };

    getStudents();
  }, []);

  // ----------------------------------------
  // Action Handlers
  // ----------------------------------------
  const handleEditStudent = (id) => {
    if (id) navigate(`update/${id}`); 
  };

  const handleAddStudent = () => navigate("create");

  const handleDeleteStudent = async (id) => {
    const isConfirmed = await Confirm(
      "آیا از حذف این دانش‌آموز اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است و تصویر وی نیز پاک خواهد شد.",
      "بله، حذف کن"
    );
    
    // Stop if user cancels
    if (!isConfirmed) return; 

    // Execute DELETE request (Backend handles image deletion)
    const deleteData = await fetchData(`student/${id}`, {
      method: "DELETE",
    });

    if (deleteData && deleteData.success !== false) {
      setStudents((prev) => prev.filter((item) => item._id !== id));
      Notify("success", "دانش‌آموز با موفقیت حذف شد.");
    } else {
      Notify("error", deleteData?.message || "خطا در حذف اطلاعات");
    }
  };
  
  // ----------------------------------------
  // Render Components
  // ----------------------------------------
  const renderedStudentCards = [...students].reverse().map((student) => (
    <StudentCard 
      key={student._id} 
      student={student} 
      onEdit={handleEditStudent} 
      onDelete={handleDeleteStudent} 
    />
  ));

  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-[#1b234d]">مدیریت دانش‌آموزان</h1>
        <button
          className="flex items-center gap-2 bg-[#51b5a5] hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={handleAddStudent}
        >
          <AddIcon />
          <span>افزودن دانش‌آموز</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 mt-10">در حال دریافت اطلاعات...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {renderedStudentCards}

          {students.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              هیچ دانش‌آموزی یافت نشد.
            </div>
          )}
        </div>
      )}
    </div>
  );
}