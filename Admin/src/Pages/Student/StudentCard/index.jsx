// ==========================================
// Dependencies & Icons
// ==========================================
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LinkIcon from '@mui/icons-material/Link';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // آیکون جایگزین

// ==========================================
// Utilities
// ==========================================
import { getImageUrl } from "../../../Utils/getImageUrl";

// ==========================================
// Component: StudentCard
// ==========================================
export default function StudentCard({ student, onEdit, onDelete }) {
  const imageUrl = getImageUrl(student.img);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="h-48 w-full bg-gray-100 relative group flex items-center justify-center">
        {student.img ? (
          <img 
            src={imageUrl} 
            alt={student.fullName} 
            className="w-full h-full object-cover transition-opacity duration-300" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-100"
          style={{ display: student.img ? 'none' : 'flex' }}
        >
          <PersonOutlineIcon fontSize="large" />
          <span className="text-sm mt-2">بدون تصویر</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-200">
            نسل {student.generation}
          </span>
        </div>

        <h2 className="text-lg font-bold text-[#1b234d] line-clamp-1 mb-1">
          {student.fullName}
        </h2>

        <p className="text-sm text-gray-500 font-medium mb-4">
          {student.job}
        </p>

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