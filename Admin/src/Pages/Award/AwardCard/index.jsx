// ==========================================
// Dependencies & Icons
// ==========================================
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// ==========================================
// Component: AwardCard
// Description: Renders individual award details and action buttons
// ==========================================
export default function AwardCard({ award, onEdit, onDelete }) {
  
  const getRankDetails = (rank) => {
    switch (Number(rank)) {
      case 1:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-600",
          border: "border-yellow-300",
          label: "1",
        };
      case 2:
        return {
          bg: "bg-slate-200",
          text: "text-slate-600",
          border: "border-slate-300",
          label: "2",
        };
      case 3:
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          border: "border-orange-300",
          label: "3",
        };
      default:
        return {
          bg: "bg-blue-50",
          text: "text-blue-500",
          border: "border-blue-200",
          label: rank || "-",
        };
    }
  };

  const rankDetails = getRankDetails(award.rank);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow mb-4">
      
      {/* Award Information Display */}
      <div className="flex items-center gap-4 flex-grow">
        
        {/* Dynamic Rank Circle */}
        <div 
          className={`w-12 h-12 flex items-center justify-center rounded-full text-xl font-black border-2 shrink-0 shadow-sm ${rankDetails.bg} ${rankDetails.text} ${rankDetails.border}`}
          title={`مقام ${rankDetails.label}`}
        >
          {rankDetails.label}
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