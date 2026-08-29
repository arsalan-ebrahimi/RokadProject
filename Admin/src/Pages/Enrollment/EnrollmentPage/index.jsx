import React, { useState, useEffect } from "react";
import fetchData from "../../../Utils/fetchData"; 
import EnrollmentCard from "../EnrollmentCard"; 
import { useNavigate } from "react-router-dom";
import Notify from "../../../Utils/notify";
import Search from "../../../Components/Search";
import Filter from "../../../Components/Filter";

export default function EnrollmentPage() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  const enrollmentFilterConfig = [
    {
      field: "grade",
      label: "پایه",
      options: ["دهم", "یازدهم"]
    },
    {
      field: "schoolType",
      label: "مدرسه",
      options: ["هنرستان پسرانه رکاد", "هنرستان دخترانه رکاد"]
    },
    {
      field: "major",
      label: "رشته",
      options: [
        { label: "تولید و توسعه پایگاه‌های اینترنتی", value: "تولید و توسعه پایگاه‌های اینترنتی (برنامه نویسی و طراحی سایت)" },
        { label: "تولید محتوای چندرسانه‌ای", value: "تولید محتوای چندرسانه‌ای (طراحی گرافیک و تولید محتوای ویدئویی و صوتی)" }
      ]
    }
  ];

  // Fetch all enrollment records on component mount
  useEffect(() => {
    const getEnrollments = async () => {
      setLoading(true);

      let url = "enrollment?";
      if (searchQuery) {
        url += `&q=${searchQuery}`;
      }
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          url += `&${key}=${encodeURIComponent(filters[key])}`;
        }
      });

      // Remove trailing or leading `?&` formatting issues smoothly:
      url = url.replace('?&', '?').replace(/\?$/, '');

      const data = await fetchData(url);
      
      if (data && data.success !== false) { 
        // Handle both direct array or data object response
        setEnrollments(Array.isArray(data) ? data : data.data || []);
      } else {
        console.error("Failed to fetch enrollments:", data?.message);
      }
      setLoading(false);
    };

    getEnrollments();
  }, [searchQuery, filters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

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
      <div className="flex flex-col mb-8 border-b pb-4 gap-4">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold text-secondary">مدیریت پیش‌ثبت‌نام‌ها</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter filterConfig={enrollmentFilterConfig} onFilterChange={handleFilterChange} />
          </div>
          <Search onSearch={handleSearch} placeholder="جستجوی پیش‌ثبت‌نام..." />
        </div>
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