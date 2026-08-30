import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../../Utils/axiosInstance";
import CommentCard from "../CommentCard";
import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Filter from "../../../Components/Filter";
import Search from "../../../Components/Search";
import Loading from "../../../Components/Loading";
import { Button, PageHeader, Card } from "../../../Components/UI";

export default function CommentPage() {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  const LIMIT = 10;

  const commentFilterConfig = [
    {
      field: "role",
      label: "نقش",
      options: [
        "دانش‌آموز",
        "پدر دانش‌آموز",
        "مادر دانش‌آموز",
        "مدیر مدرسه",
        "معلم",
        "معاون",
        "مشاور",
      ],
    },
  ];

  const fetchComments = async (pageNumber, query, currentFilters = {}) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let url = `comment?limit=${LIMIT}&page=${pageNumber}&sort=-_id`;
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
        const fetchedComments = Array.isArray(data) ? data : data.data || [];

        if (fetchedComments.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (pageNumber === 1) {
          setComments(fetchedComments);
        } else {
          setComments((prev) => {
            const uniqueNewItems = fetchedComments.filter(
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
    fetchComments(page, searchQuery, filters);
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

  const handleEditComment = (id) => {
    if (id) navigate(`update/${id}`);
  };

  const handleAddComment = () => {
    navigate("create");
  };

  const handleDeleteComment = async (id) => {
    const isConfirmed = await confirm(
      "آیا از حذف این نظر اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است و تصویر دستی آن نیز پاک خواهد شد.",
      "بله، حذف کن"
    );

    if (!isConfirmed) return;

    try {
      const deleteData = await axiosInstance.delete(`comment/${id}`);

      if (deleteData && deleteData.success !== false) {
        setComments((prev) => prev.filter((item) => item._id !== id));
        Notify("success", "نظر با موفقیت حذف شد.");
      } else {
        Notify("error", deleteData?.message || "خطا در حذف نظر");
      }
    } catch (error) {
      Notify("error", error.message || "خطا در حذف نظر");
    }
  };

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="مدیریت نظرات"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={handleAddComment}
          >
            افزودن نظر
          </Button>
        }
      >
        <Card className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 shadow-xs">
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter
              filterConfig={commentFilterConfig}
              onFilterChange={handleFilterChange}
            />
          </div>
          <Search onSearch={handleSearch} placeholder="جستجوی نظرات..." />
        </Card>
      </PageHeader>

      {/* Main List */}
      {loading && page === 1 ? (
        <div className="flex justify-center mt-20">
          <Loading size={12} />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {comments.map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>

          {comments.length === 0 && !loading && (
            <div className="text-center text-text-secondary py-14">
              هیچ نظری یافت نشد.
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