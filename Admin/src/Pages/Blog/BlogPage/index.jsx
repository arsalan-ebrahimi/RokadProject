// ==========================================
// Page Component: BlogPage (Blog List)
// Displays paginated/infinite-scrolling list of blog articles with live search and undoable delete
// ==========================================

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../../Utils/axiosInstance";
import BlogCard from "../BlogCard";
import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Search from "../../../Components/Search";
import Loading from "../../../Components/Loading";
import { Button, PageHeader, Card } from "../../../Components/UI";
import { useUndoableDelete } from "../../../Hooks";

/**
 * Blog list page with search, infinite scrolling, and undoable delete workflow.
 */
export default function BlogPage() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const isFetchingRef = useRef(false);

  const LIMIT = 12;

  // Undoable Delete Hook: manages 5s countdown window and optimistic UI filtering
  const {
    visibleItems: visibleBlogs,
    requestDelete,
  } = useUndoableDelete({
    entity: "article",
    entityLabel: "مقاله",
    items: blogs,
    getId: (item) => item?._id,
    getLabel: (blog) => blog?.title || "",
    deleteFn: (id) => axiosInstance.delete(`blog/${id}`),
    onDeleted: (id) => {
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    },
    duration: 5000,
  });

  const fetchBlogs = async (pageNumber, query) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);
    isFetchingRef.current = true;

    try {
      const data = await axiosInstance.get(
        `blog?limit=${LIMIT}&page=${pageNumber}&sort=-_id${query ? `&q=${query}` : ""}`
      );

      if (data && data.success !== false) {
        const fetchedBlogs = Array.isArray(data) ? data : data.data || [];

        if (fetchedBlogs.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (pageNumber === 1) {
          setBlogs(fetchedBlogs);
        } else {
          setBlogs((prev) => {
            const uniqueNewItems = fetchedBlogs.filter(
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
    fetchBlogs(page, searchQuery);
  }, [page, searchQuery]);

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

  const handleEditBlog = (data) => {
    const blogId = typeof data === "object" ? data._id : data;
    if (blogId) navigate(`update/${blogId}`);
  };

  const handleAddBlog = () => navigate("create");

  const handleDeleteBlog = async (itemOrId) => {
    const article =
      typeof itemOrId === "object" && itemOrId !== null
        ? itemOrId
        : blogs.find((b) => b._id === itemOrId);

    if (!article) return;

    const isConfirmed = await confirm(
      "آیا از حذف این مقاله اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است و تصویر آن نیز پاک خواهد شد.",
      "بله، حذف کن"
    );

    if (!isConfirmed) return;

    requestDelete(article);
  };

  return (
    <div dir="rtl" className="p-4 sm:p-6 md:p-8 w-full bg-background min-h-dvh">
      <PageHeader
        title="مدیریت بلاگ‌ها"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={handleAddBlog}
            className="w-full sm:w-auto"
          >
            افزودن بلاگ
          </Button>
        }
      >
        <Card className="flex flex-col sm:flex-row justify-end p-3 shadow-xs">
          <Search onSearch={handleSearch} placeholder="جستجوی بلاگ..." className="w-full sm:w-80" />
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
            {visibleBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onEdit={handleEditBlog}
                onDelete={handleDeleteBlog}
              />
            ))}
          </div>

          {visibleBlogs.length === 0 && !loading && (
            <div className="col-span-full text-center text-text-secondary py-14">
              هیچ بلاگی یافت نشد.
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
