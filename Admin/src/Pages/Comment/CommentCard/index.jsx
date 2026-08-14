// ==========================================
// Dependencies & Icons
// ==========================================
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// ==========================================
// Utilities
// ==========================================
import { getImageUrl } from "../../../Utils/getImageUrl"; // Dynamic URL helper

// ==========================================
// Component: CommentCard
// Description: Renders an individual comment item
// ==========================================
export default function CommentCard({ comment, onEdit, onDelete }) {
  
  // Helper to determine styling for role badges
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "معلم": return "bg-blue-50 text-blue-600 border-blue-200";
      case "اولیا": return "bg-green-50 text-green-600 border-green-200";
      case "دانش آموز": return "bg-orange-50 text-orange-600 border-orange-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  // Determine correct image URL using our helper
  const avatarUrl = getImageUrl(comment.img);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row items-start md:items-center justify-between hover:shadow-md transition-shadow mb-4 gap-4">
      
      {/* Content display */}
      <div className="flex flex-col gap-2 flex-grow">
        
        {/* Header containing Avatar, Name, Role */}
        <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-[#1b234d] font-bold">
                <img 
                  src={avatarUrl} 
                  alt={comment.author} 
                  className="w-8 h-8 object-cover rounded-full border border-gray-200" 
                />
                <span>{comment.author}</span>
            </div>
            
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(comment.role)}`}>
                {comment.role}
            </span>
        </div>

        {/* The actual comment message */}
        <p className="text-sm text-gray-600 leading-relaxed mt-2">
            {comment.content}
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-2 self-end md:self-center">
        <button
          onClick={() => onEdit(comment._id)}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="ویرایش"
        >
          <EditIcon fontSize="small" />
        </button>
        <button
          onClick={() => onDelete(comment._id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="حذف"
        >
          <DeleteOutlineIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
}