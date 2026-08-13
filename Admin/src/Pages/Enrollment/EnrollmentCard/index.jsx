import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function EnrollmentCard({ enrollment, onEdit, onDelete }) {
  
  // Dynamic badge styling based on school type
  const getSchoolBadgeStyle = (type) => {
    if (type === "هنرستان پسرانه رکاد") {
      return "bg-blue-50 text-blue-600 border-blue-200";
    } else if (type === "هنرستان دخترانه رکاد") {
      return "bg-pink-50 text-pink-600 border-pink-200";
    }
    return "bg-gray-50 text-gray-600 border-gray-200"; 
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow mb-4">
      
      {/* Student Details Section */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
        
        {/* Full Name display */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <span className="text-sm text-gray-500">نام و نام خانوادگی:</span>
          <h2 className="text-lg font-bold text-[#1b234d]">
            {enrollment.firstName} {enrollment.lastName}
          </h2>
        </div>

        {/* National ID display */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">کد ملی:</span>
          <span className="text-md font-semibold text-gray-700">
            {enrollment.nationalCode}
          </span>
        </div>

        {/* School type badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">مدرسه:</span>
          <span 
            className={`text-xs md:text-sm font-semibold px-3 py-1 rounded-full border ${getSchoolBadgeStyle(enrollment.schoolType)}`}
          >
            {enrollment.schoolType || "نامشخص"}
          </span>
        </div>

      </div>

      {/* Action Buttons: Edit and Delete */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(enrollment._id)}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="ویرایش"
        >
          <EditIcon fontSize="small" />
        </button>
        <button
          onClick={() => onDelete(enrollment._id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="حذف"
        >
          <DeleteOutlineIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
}