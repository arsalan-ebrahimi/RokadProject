import React, { useState, useEffect } from "react";
import fetchData from "../../../Utils/fetchData"; 
import CommentCard from "../CommentCard"; 
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Notify from "../../../Utils/notify";

export default function CommentPage() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize comment list from server
  useEffect(() => {
    const getComments = async () => {
      setLoading(true);
      
      const data = await fetchData("comment");
      
      if (data && data.success !== false) { 
        setComments(Array.isArray(data) ? data : data.data || []);
      } else {
        console.error("Failed to fetch comments:", data?.message);
      }
      setLoading(false);
    };

    getComments();
  }, []);

  const handleEditComment = (id) => {
    if (id) {
      navigate(`update/${id}`); 
    }
  };

  const handleAddComment = () => {
    navigate("create");
  };

  // Delete comment by ID with confirmation
  const handleDeleteComment = async (id) => {
    const isConfirmed = window.confirm("آیا از حذف این نظر اطمینان دارید؟");
    
    if (!isConfirmed) return; 

    const deleteData = await fetchData(`comment/${id}`, {
      method: "DELETE",
    });

    if (deleteData && deleteData.success !== false) {
      setComments((prevComments) => prevComments.filter((item) => item._id !== id));
      Notify("success", "نظر با موفقیت حذف شد.");
    } else {
      Notify("error", deleteData?.message || "خطا در حذف نظر");
    }
  };
  
  // Create comment cards list (reversed to show newest first)
  const renderedCommentCards = [...comments].reverse().map((comment) => (
    <CommentCard 
      key={comment._id} 
      comment={comment} 
      onEdit={handleEditComment} 
      onDelete={handleDeleteComment} 
    />
  ));

  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      
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

      {loading ? (
        <div className="text-center text-gray-500 mt-10">در حال دریافت اطلاعات...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {renderedCommentCards}

          {comments.length === 0  && (
            <div className="text-center text-gray-500 py-10">
              هیچ نظری یافت نشد.
            </div>
          )}
        </div>
      )}
    </div>
  );
}