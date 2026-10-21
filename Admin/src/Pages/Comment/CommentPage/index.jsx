// ==========================================
// Page Component: CommentPage (Testimonials List)
// Displays student, parent, and teacher testimonials with role filtering, live search, and undoable delete
// ==========================================

import React, { useState, useEffect, useRef } from "react";
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
import { useUndoableDelete } from "../../../Hooks";

/**
 * Comments/testimonials list page with role filters, search, and undoable delete workflow.
 */
export default function CommentPage() {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const isFetchingRef = useRef(false);

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

  // Undoable Delete Hook: manages 5s countdown window and optimistic UI filtering
  const {
    visibleItems: visibleComments,
    requestDelete,
  } = useUndoableDelete({
    entity: "comment",
    entityLabel: "نظر",
    items: comments,
    getId: (item) => item?._id,
    getLabel: (comment) => comment?.author || comment?.authorName || comment?.name || "",
    deleteFn: (id) => axiosInstance.delete(`comment/${id}`),
    onDeleted: (id) => {
      setComments((prev) => prev.filter((item) => item._id !== id));
    },
    duration: 5000,
  });

  const fetchComments = async (pageNumber, query, currentFilters = {}) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);
    isFetchingRef.current = true;

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
    fetchComments(page, searchQuery, filters);
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

    requestDelete(id);
  };

  return (
    <div dir="rtl" className="p-4 sm:p-6 md:p-8 w-full bg-background min-h-dvh">
      <PageHeader
        title="مدیریت نظرات"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={handleAddComment}
            className="w-full sm:w-auto"
          >
            افزودن نظر
          </Button>
        }
      >
        <Card className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 md:gap-4 p-3 sm:p-4 shadow-xs">
          <Filter
            filterConfig={commentFilterConfig}
            onFilterChange={handleFilterChange}
          />
          <Search onSearch={handleSearch} placeholder="جستجوی نظرات..." className="w-full md:w-80" />
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
            {visibleComments.map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>

          {visibleComments.length === 0 && !loading && (
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
