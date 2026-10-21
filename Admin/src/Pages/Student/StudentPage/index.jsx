// ==========================================
// Page Component: StudentPage (Student List)
// Displays student alumni directory with filters by generation, school branch, and major
// ==========================================

import React, { useState, useEffect, useRef } from "react";
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
import { useUndoableDelete } from "../../../Hooks";

/**
 * Student directory page with multi-field filters, search, and undoable delete workflow.
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
  const isFetchingRef = useRef(false);

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

  // Undoable Delete Hook: manages 5s countdown window and optimistic UI filtering
  const {
    visibleItems: visibleStudents,
    requestDelete,
  } = useUndoableDelete({
    entity: "student",
    entityLabel: "دانش‌آموز",
    items: students,
    getId: (item) => item?._id,
    getLabel: (student) => student?.fullName || student?.name || "",
    deleteFn: (id) => axiosInstance.delete(`student/${id}`),
    onDeleted: (id) => {
      setStudents((prev) => prev.filter((item) => item._id !== id));
    },
    duration: 5000,
  });

  const fetchStudents = async (pageNumber, query, currentFilters = {}) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);
    isFetchingRef.current = true;

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
        setHasMore(false);
        Notify("error", data?.message || "خطا در دریافت اطلاعات");
      }
    } catch (error) {
      setHasMore(false);
      Notify("error", error.message || "خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchStudents(page, searchQuery, filters);
  }, [page, searchQuery, filters]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loading || loadingMore || isFetchingRef.current) return;

      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

      if (scrollHeight > clientHeight + 100 && scrollTop > 60) {
        if (scrollTop + clientHeight >= scrollHeight - 160) {
          isFetchingRef.current = true;
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadingMore]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
    isFetchingRef.current = false;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
    isFetchingRef.current = false;
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

    requestDelete(id);
  };

  return (
    <div dir="rtl" className="p-4 sm:p-6 md:p-8 w-full bg-background min-h-dvh">
      <PageHeader
        title="مدیریت دانش‌آموزان"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={handleAddStudent}
            className="w-full sm:w-auto"
          >
            افزودن دانش‌آموز
          </Button>
        }
      >
        <Card className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 md:gap-4 p-3 sm:p-4 shadow-xs">
          <Filter
            filterConfig={studentFilterConfig}
            onFilterChange={handleFilterChange}
          />
          <Search onSearch={handleSearch} placeholder="جستجوی دانش‌آموز..." className="w-full md:w-80" />
        </Card>
      </PageHeader>

      {/* Main Content Area */}
      {loading && page === 1 ? (
        <div className="flex justify-center mt-20">
          <Loading size={12} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch">
            {visibleStudents.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            ))}
          </div>

          {visibleStudents.length === 0 && !loading && (
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
