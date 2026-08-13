import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import fetchData from "../../../Utils/fetchData"; 
import BlogCard from "../BlogCard";
import { useNavigate } from "react-router-dom";
import Notify from "../../../Utils/notify";

export default function BlogPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize blog list
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

  const handleEditBlog = (data) => {
    const blogId = typeof data === "object" ? data._id : data;
    if (blogId) navigate(`update/${blogId}`); 
  };

  const handleAddBlog = () => navigate("create");

  // Logic to delete blog and cleanup associated image
  const handleDeleteBlog = async (id) => {
    const isConfirmed = window.confirm("آیا از حذف این بلاگ اطمینان دارید؟ این عمل غیرقابل بازگشت است.");
    if (!isConfirmed) return;

    const blogToDelete = blogs.find((b) => b._id === id);

    const deleteData = await fetchData(`blog/${id}`, {
      method: "DELETE",
    });

    if (deleteData && deleteData.success !== false) {
      // Remove file from server storage
      if (blogToDelete && blogToDelete.img) {
        await fetchData("upload/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: blogToDelete.img }),
        });
      }

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      Notify("success", "بلاگ با موفقیت حذف شد.");
    } else {
      Notify("error", deleteData?.message || "حذف بلاگ ناموفق بود");
    }
  };
  
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

      {loading ? (
        <div className="text-center text-gray-500 mt-10">در حال دریافت اطلاعات...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {renderedBlogCards}
          {blogs.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">هیچ بلاگی یافت نشد.</div>
          )}
        </div>
      )}
    </div>
  );
}