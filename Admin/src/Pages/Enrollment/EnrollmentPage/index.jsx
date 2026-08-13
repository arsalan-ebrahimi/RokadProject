import React, { useState, useEffect } from "react";
import fetchData from "../../../Utils/fetchData"; 
import EnrollmentCard from "../EnrollmentCard"; 
import { useNavigate } from "react-router-dom";
import Notify from "../../../Utils/notify";

export default function EnrollmentPage() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all enrollment records on component mount
  useEffect(() => {
    const getEnrollments = async () => {
      setLoading(true);
      const data = await fetchData("enrollment");
      
      if (data && data.success !== false) { 
        // Handle both direct array or data object response
        setEnrollments(Array.isArray(data) ? data : data.data || []);
      } else {
        console.error("Failed to fetch enrollments:", data?.message);
      }
      setLoading(false);
    };

    getEnrollments();
  }, []);

  // Navigate to update form for a specific record
  const handleEditEnrollment = (id) => {
    if (id) {
      navigate(`update/${id}`); 
    }
  };

  // Delete an enrollment record with user confirmation
  const handleDeleteEnrollment = async (id) => {
    const isConfirmed = window.confirm("آیا از حذف این پیش‌ثبت‌نام اطمینان دارید؟ این عمل غیرقابل بازگشت است.");
    if (!isConfirmed) return; 

    const deleteData = await fetchData(`enrollment/${id}`, {
      method: "DELETE",
    });

    if (deleteData && deleteData.success !== false) {
      // Update local state to remove the deleted item from UI
      setEnrollments((prevEnrollments) => prevEnrollments.filter((item) => item._id !== id));
      Notify("success", "پیش‌ثبت‌نام با موفقیت حذف شد.");
    } else {
      Notify("error", deleteData?.message || "خطا در حذف اطلاعات");
    }
  };
  
  // Render cards in reverse order to show newest entries first
  const renderedEnrollmentCards = [...enrollments].reverse().map((enrollment) => (
    <EnrollmentCard 
      key={enrollment._id} 
      enrollment={enrollment} 
      onEdit={handleEditEnrollment} 
      onDelete={handleDeleteEnrollment} 
    />
  ));

  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-[#1b234d]">مدیریت پیش‌ثبت‌نام‌ها</h1>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 mt-10">در حال دریافت اطلاعات...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {renderedEnrollmentCards}

          {enrollments.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              هیچ پیش‌ثبت‌نامی یافت نشد.
            </div>
          )}
        </div>
      )}
    </div>
  );
}