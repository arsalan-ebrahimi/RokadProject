import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { Card, Button } from "../../../Components/UI";

export default function BlogCard({ blog, onEdit, onDelete }) {
  const imageUrl = getImageUrl(blog.img);

  return (
    <Card hoverable className="overflow-hidden flex flex-col group h-full">
      {/* Blog Thumbnail */}
      <div className="h-48 w-full bg-bg-light relative overflow-hidden border-b border-border/60">
        {blog.img ? (
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-medium">
            بدون تصویر
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-base md:text-lg font-bold text-secondary line-clamp-2 leading-[1.4] min-h-[2.8em] mb-1">
          {blog.title}
        </h2>

        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2.5">
          <CalendarTodayIcon fontSize="inherit" />
          <span>{blog.date}</span>
        </div>

        <p className="text-xs md:text-sm text-text-secondary line-clamp-3 mb-4 flex-grow leading-relaxed">
          {blog.description}
        </p>

        {/* Action Buttons Toolbar */}
        <div className="flex justify-end items-center gap-1 mt-auto pt-3 border-t border-border-light">
          <Button
            variant="info-ghost"
            size="icon-sm"
            onClick={() => onEdit(blog)}
            title="ویرایش"
          >
            <EditIcon fontSize="small" />
          </Button>

          <Button
            variant="danger-ghost"
            size="icon-sm"
            onClick={() => onDelete(blog._id)}
            title="حذف"
          >
            <DeleteOutlineIcon fontSize="small" />
          </Button>
        </div>
      </div>
    </Card>
  );
}