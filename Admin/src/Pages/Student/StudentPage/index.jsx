// ==========================================
// Page Component: StudentPage (Student List)
// Displays student alumni directory with filters by generation, school branch, and major
// ==========================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../../Utils/axiosInstance";
import StudentCard from "../StudentCard";
import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Filter from "../../../Components/Filter";
import Search from "../../../Components/Search";
import Loading from "../../../Components/Loading";
import { Button, PageHeader, Card } from "../../../Components/UI";

/**
 * Student directory page with multi-field filters, search, and deletion handling.
 */
export default function StudentPage() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  const LIMIT = 12;

  const studentFilterConfig = [
    {
      field: "generation",
      label: "نسل",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      field: "schoolType",
      label: "مدرسه",
      options: ["هنرستان دخترانه رکاد", "هنرستان پسرانه رکاد"],
    },
    {
      field: "major",
      label: "رشته",
      options: [
        {
          label: "تولید و توسعه پایگاه‌های اینترنتی",
          value: "تولید و توسعه پایگاه‌های اینترنتی (برنامه نویسی و طراحی سایت)",
        },
        {
          label: "تولید محتوای چندرسانه‌ای",
          value: "تولید محتوای چندرسانه‌ای (طراحی گرافیک و تولید محتوای ویدئویی و صوتی)",
        },
      ],
    },
  ];

  const fetchStudents = async (pageNumber, query, currentFilters = {}) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let url = `student?limit=${LIMIT}&page=${pageNumber}&sort=-_id`;
      if (query) {
        url += `&q=${query}`;
      }

      Object.keys(currentFilters).forEach((key) => {
        if (currentFilters[key]) {
          url += `&${key}=${encodeURIComponent(currentFilters[key])}`;
        }
      });

      const data = await axiosInstance.get(url);

      if (data && data.success !== false) {
        const fetchedStudents = Array.isArray(data) ? data : data.data || [];

        if (fetchedStudents.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (pageNumber === 1) {
          setStudents(fetchedStudents);
        } else {
          setStudents((prev) => {
            const uniqueNewItems = fetchedStudents.filter(
              (newItem) =>
                !prev.some((existingItem) => existingItem._id === newItem._id)
            );
            return [...prev, ...uniqueNewItems];
          });
        }
      } else {
        Notify("error", data?.message || "خطا در دریافت اطلاعات");
      }
    } catch (error) {
      Notify("error", error.message || "خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchStudents(page, searchQuery, filters);
  }, [page, searchQuery, filters]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (hasMore && !loading && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadingMore]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
  };

  const handleEditStudent = (id) => {
    if (id) navigate(`update/${id}`);
  };

  const handleAddStudent = () => navigate("create");

  const handleDeleteStudent = async (id) => {
    const isConfirmed = await confirm(
      "آیا از حذف این دانش‌آموز اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است و تصویر وی نیز پاک خواهد شد.",
      "بله، حذف کن"
    );

    if (!isConfirmed) return;

    try {
      const deleteData = await axiosInstance.delete(`student/${id}`);

      if (deleteData && deleteData.success !== false) {
        setStudents((prev) => prev.filter((item) => item._id !== id));
        Notify("success", "دانش‌آموز با موفقیت حذف شد.");
      } else {
        Notify("error", deleteData?.message || "خطا در حذف اطلاعات");
      }
    } catch (error) {
      Notify("error", error.message || "خطا در حذف اطلاعات");
    }
  };

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="مدیریت دانش‌آموزان"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={handleAddStudent}
          >
            افزودن دانش‌آموز
          </Button>
        }
      >
        <Card className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 shadow-xs">
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter
              filterConfig={studentFilterConfig}
              onFilterChange={handleFilterChange}
            />
          </div>
          <Search onSearch={handleSearch} placeholder="جستجوی دانش‌آموز..." />
        </Card>
      </PageHeader>

      {/* Main Content Area */}
      {loading && page === 1 ? (
        <div className="flex justify-center mt-20">
          <Loading size={12} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {students.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            ))}
          </div>

          {students.length === 0 && !loading && (
            <div className="col-span-full text-center text-text-secondary py-14">
              هیچ دانش‌آموزی یافت نشد.
            </div>
          )}

          {loadingMore && (
            <div className="flex justify-center mt-8 py-4 pb-10">
              <Loading size={10} />
            </div>
          )}
        </>
      )}
    </div>
  );
}