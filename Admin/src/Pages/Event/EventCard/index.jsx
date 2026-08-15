// ==========================================
// Dependencies & Icons
// ==========================================
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// ==========================================
// Utilities
// ==========================================
import { getImageUrl } from "../../../Utils/getImageUrl"; 

// ==========================================
// Component: EventCard
// Description: Renders individual event details with image
// ==========================================
export default function EventCard({ event, onEdit, onDelete }) {
  
  const getBranchBadgeStyle = (branch) => {
    return branch === "دخترانه" 
      ? "bg-pink-50 text-pink-600 border-pink-200"
      : "bg-blue-50 text-blue-600 border-blue-200";
  };

  // Generate valid URL for the image
  const imageUrl = getImageUrl(event.img);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      
      {/* Event Image Thumbnail */}
      <div className="h-48 w-full bg-gray-200 relative">
        {event.img ? (
          <img src={imageUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">بدون تصویر</div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
            {event.type}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${getBranchBadgeStyle(event.branch)}`}>
            شعبه {event.branch}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-[#1b234d] line-clamp-1 mb-2">
          {event.title}
        </h2>

        {/* Date */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <CalendarTodayIcon fontSize="small" className="text-gray-400" />
          <span>{event.date}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
          {event.description}
        </p>

        {/* Action Toolbar */}
        <div className="flex justify-end gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(event._id)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="ویرایش"
          >
            <EditIcon fontSize="small" />
          </button>
          <button
            onClick={() => onDelete(event._id)}
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