// ==========================================
// Dependencies & Icons
// ==========================================
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LinkIcon from '@mui/icons-material/Link';

// ==========================================
// Utilities
// ==========================================
import { getImageUrl } from "../../../Utils/getImageUrl";

// ==========================================
// Component: StudentCard
// Description: Renders individual student details
// ==========================================
export default function StudentCard({ student, onEdit, onDelete }) {
  const imageUrl = getImageUrl(student.img);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      
      {/* Student Image Thumbnail */}
      <div className="h-48 w-full bg-gray-200 relative">
        {student.img ? (
          <img src={imageUrl} alt={student.fullName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">بدون تصویر</div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Generation Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-200">
            نسل {student.generation}
          </span>
        </div>

        {/* Full Name */}
        <h2 className="text-lg font-bold text-[#1b234d] line-clamp-1 mb-1">
          {student.fullName}
        </h2>

        {/* Job */}
        <p className="text-sm text-gray-500 font-medium mb-4">
          {student.job}
        </p>

        {/* Social Links Rendering */}
        <div className="flex flex-wrap gap-2 mb-4 flex-grow">
          {student.socialLinks && student.socialLinks.map((social, index) => (
            <a 
              key={index} 
              href={social.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
            >
              <LinkIcon fontSize="inherit" />
              <span>{social.type}</span>
            </a>
          ))}
        </div>

        {/* Action Toolbar */}
        <div className="flex justify-end gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(student._id)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="ویرایش"
          >
            <EditIcon fontSize="small" />
          </button>
          <button
            onClick={() => onDelete(student._id)}
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