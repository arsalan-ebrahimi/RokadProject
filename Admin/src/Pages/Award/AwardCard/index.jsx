// ==========================================
// Dependencies & Icons
// ==========================================
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// ==========================================
// Component: AwardCard
// Description: Renders individual award details and action buttons
// ==========================================
export default function AwardCard({ award, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow mb-4">
      
      {/* Award Information Display */}
      <div className="flex items-center gap-4 flex-grow">
        
        {/* Visual Decoration Icon */}
        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full">
            <EmojiEventsIcon />
        </div>

        {/* Title and Label */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">عنوان جایزه:</span>
          <h2 className="text-lg font-bold text-[#1b234d] line-clamp-1">
            {award.title}
          </h2>
        </div>
      </div>

      {/* Action Buttons: Edit and Delete */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onEdit(award._id)}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="ویرایش"
        >
          <EditIcon fontSize="small" />
        </button>
        <button
          onClick={() => onDelete(award._id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="حذف"
        >
          <DeleteOutlineIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
}