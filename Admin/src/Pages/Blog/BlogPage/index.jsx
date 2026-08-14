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
import Confirm from "../../../Utils/Confirm"; // Custom SweetAlert2 Confirm

// ==========================================
// Component: BlogPage
// Description: Manages and displays the list of blog posts
// ==========================================
export default function BlogPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------
  // Fetch Blogs Data on Mount
  // ----------------------------------------
  useEffect(() => {
    const getBlogs = async () => {
      setLoading(true);
      const data = await fetchData("blog");
      
      if (data && data.success !== false) {
        setBlogs(Array.isArray(data) ? data : data.data || []);
      }
      setLoading(false);
    };
    
    getBlogs();
  }, []);

  // ----------------------------------------
  // Action Handlers
  // ----------------------------------------

  // Navigate to edit page
  const handleEditBlog = (data) => {
    const blogId = typeof data === "object" ? data._id : data;
    if (blogId) navigate(`update/${blogId}`); 
  };

  // Navigate to create page
  const handleAddBlog = () => navigate("create");

  // Handle blog deletion with custom confirmation
  const handleDeleteBlog = async (id) => {
    const isConfirmed = await Confirm(
      "آیا از حذف این بلاگ اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است و تصویر آن نیز حذف خواهد شد.",
      "بله، حذف کن"
    );

    // Cancel deletion if user aborts
    if (!isConfirmed) return;

    const blogToDelete = blogs.find((b) => b._id === id);

    // Execute DELETE request to backend
    const deleteData = await fetchData(`blog/${id}`, {
      method: "DELETE",
    });

    if (deleteData && deleteData.success !== false) {
      // Clean up associated image from server storage
      if (blogToDelete && blogToDelete.img) {
        await fetchData("upload/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: blogToDelete.img }),
        });
      }

      // Update local state to remove the deleted blog
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      Notify("success", "بلاگ با موفقیت حذف شد.");
    } else {
      Notify("error", deleteData?.message || "حذف بلاگ ناموفق بود");
    }
  };
  
  // ----------------------------------------
  // Render Components
  // ----------------------------------------
  const renderedBlogCards = [...blogs].reverse().map((blog) => (
    <BlogCard 
      key={blog._id} 
      blog={blog} 
      onEdit={handleEditBlog} 
      onDelete={handleDeleteBlog} 
    />
  ));

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
      {loading ? (
        <div className="text-center text-gray-500 mt-10">در حال دریافت اطلاعات...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {renderedBlogCards}
          
          {/* Empty State */}
          {blogs.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">هیچ بلاگی یافت نشد.</div>
          )}
        </div>
      )}
    </div>
  );
}