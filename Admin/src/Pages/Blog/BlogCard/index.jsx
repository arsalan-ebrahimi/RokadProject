// ==========================================
// Dependencies & Icons
// ==========================================
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// ==========================================
// Component: BlogCard
// Description: Renders an individual blog post item
// ==========================================
export default function BlogCard({ blog, onEdit, onDelete }) {
  // Construct the correct image URL
  const baseUrl = import.meta.env.VITE_FILE_URL || "http://localhost:1337";
  const imageUrl = blog.img?.startsWith("http") ? blog.img : `${baseUrl}/${blog.img}`;
  const cleanUrl = imageUrl.replace(/([^:]\/)\/+/g, "$1"); 

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      
      {/* Blog Thumbnail Image */}
      <div className="h-48 w-full bg-gray-200 relative">
        {blog.img ? (
          <img src={cleanUrl} alt={blog.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">بدون تصویر</div>
        )}
      </div>

      {/* Blog Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-bold text-[#1b234d] line-clamp-1 mb-1">{blog.title}</h2>
        <span className="text-sm text-gray-400 mb-3">{blog.date}</span>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">{blog.description}</p>

        {/* Action Buttons Toolbar */}
        <div className="flex justify-end gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(blog)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="ویرایش"
          >
            <EditIcon fontSize="small" />
          </button>
          <button
            onClick={() => onDelete(blog._id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
          >
            <DeleteOutlineIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
}