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
import CommentCard from "../CommentCard"; 
import Notify from "../../../Utils/notify";
import Confirm from "../../../Utils/Confirm"; 
import Loading from "../../../Components/Loading"; 

// ==========================================
// Component: CommentPage
// Description: Lists all comments with Infinite Scroll
// ==========================================
export default function CommentPage() {
  const navigate = useNavigate();
  
  // ----------------------------------------
  // State Management
  // ----------------------------------------
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Since it's a vertical list, 10 is a good chunk size
  const LIMIT = 10;

  // ----------------------------------------
  // Fetch Data Function
  // ----------------------------------------
  const fetchComments = async (pageNumber) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    const data = await fetchData(`comment?limit=${LIMIT}&page=${pageNumber}&sort=-_id`);
    
    if (data && data.success !== false) { 
      const fetchedComments = Array.isArray(data) ? data : data.data || [];
      
      if (fetchedComments.length < LIMIT) {
        setHasMore(false);
      }

      if (pageNumber === 1) {
        setComments(fetchedComments);
      } else {
        setComments((prev) => [...prev, ...fetchedComments]);
      }
    } else {
      Notify("error", data?.message || "خطا در دریافت اطلاعات");
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchComments(page);
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
  const handleEditComment = (id) => {
    if (id) navigate(`update/${id}`); 
  };

  const handleAddComment = () => {
    navigate("create");
  };

  const handleDeleteComment = async (id) => {
    const isConfirmed = await Confirm(
      "آیا از حذف این نظر اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است و تصویر دستی آن (در صورت وجود) نیز پاک خواهد شد.",
      "بله، حذف کن"
    );
    
    if (!isConfirmed) return; 

    const deleteData = await fetchData(`comment/${id}`, { method: "DELETE" });

    if (deleteData && deleteData.success !== false) {
      setComments((prev) => prev.filter((item) => item._id !== id));
      Notify("success", "نظر با موفقیت حذف شد.");
    } else {
      Notify("error", deleteData?.message || "خطا در حذف نظر");
    }
  };
  
  // ----------------------------------------
  // Render Component
  // ----------------------------------------
  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-[#1b234d]">مدیریت نظرات</h1>
        <button
          className="flex items-center gap-2 bg-[#51b5a5] hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={handleAddComment}
        >
          <AddIcon />
          <span>افزودن نظر</span>
        </button>
      </div>

      {/* Initial Full Page Loading */}
      {loading && page === 1 ? (
        <div className="flex justify-center mt-20">
          <Loading size={12} />
        </div>
      ) : (
        <>
          {/* Main List */}
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <CommentCard 
                key={comment._id} 
                comment={comment} 
                onEdit={handleEditComment} 
                onDelete={handleDeleteComment} 
              />
            ))}
          </div>

          {/* Empty State */}
          {comments.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-10">
              هیچ نظری یافت نشد.
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