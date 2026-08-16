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
import BlogCard from "../BlogCard";
import Notify from "../../../Utils/notify";
import Confirm from "../../../Utils/Confirm";
import Loading from "../../../Components/Loading";

// ==========================================
// Component: BlogPage
// Description: Manages and displays the list of blog posts with Infinite Scroll
// ==========================================
export default function BlogPage() {
  const navigate = useNavigate();

  // ----------------------------------------
  // State Management
  // ----------------------------------------
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Grid has up to 4 columns, so 12 is optimal
  const LIMIT = 12;

  // ----------------------------------------
  // Fetch Data Function
  // ----------------------------------------
  const fetchBlogs = async (pageNumber) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    const data = await fetchData(
      `blog?limit=${LIMIT}&page=${pageNumber}&sort=-_id`,
    );

    if (data && data.success !== false) {
      const fetchedBlogs = Array.isArray(data) ? data : data.data || [];

      if (fetchedBlogs.length < LIMIT) {
        setHasMore(false);
      }

      if (pageNumber === 1) {
        setBlogs(fetchedBlogs);
      } else {
        setBlogs((prev) => {
          const uniqueNewItems = fetchedBlogs.filter(
            (newItem) =>
              !prev.some((existingItem) => existingItem._id === newItem._id),
          );
          return [...prev, ...uniqueNewItems];
        });
      }
    } else {
      Notify("error", data?.message || "خطا در دریافت اطلاعات");
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  // ----------------------------------------
  // Infinite Scroll Listener
  // ----------------------------------------
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

  // ----------------------------------------
  // Action Handlers
  // ----------------------------------------
  const handleEditBlog = (data) => {
    const blogId = typeof data === "object" ? data._id : data;
    if (blogId) navigate(`update/${blogId}`);
  };

  const handleAddBlog = () => navigate("create");

  const handleDeleteBlog = async (id) => {
    const isConfirmed = await Confirm(
      "آیا از حذف این بلاگ اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است و تصویر آن نیز حذف خواهد شد.",
      "بله، حذف کن",
    );

    if (!isConfirmed) return;

    const deleteData = await fetchData(`blog/${id}`, {
      method: "DELETE",
    });

    if (deleteData && deleteData.success !== false) {
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      Notify("success", "بلاگ با موفقیت حذف شد.");
    } else {
      Notify("error", deleteData?.message || "حذف بلاگ ناموفق بود");
    }
  };

  // ----------------------------------------
  // Render Component
  // ----------------------------------------
  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-[#1b234d]">مدیریت بلاگ‌ها</h1>
        <button
          className="flex items-center gap-2 bg-[#51b5a5] hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={handleAddBlog}
        >
          <AddIcon />
          <span>افزودن بلاگ</span>
        </button>
      </div>

      {/* Main Content Area */}
      {loading && page === 1 ? (
        <div className="flex justify-center mt-20">
          <Loading size={12} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onEdit={handleEditBlog}
                onDelete={handleDeleteBlog}
              />
            ))}
          </div>

          {blogs.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-10">
              هیچ بلاگی یافت نشد.
            </div>
          )}

          {/* Loading indicator for Infinite Scroll */}
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
