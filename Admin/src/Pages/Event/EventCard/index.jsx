import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { Card, Badge, Button } from "../../../Components/UI";

export default function EventCard({ event, onEdit, onDelete }) {
  const imageUrl = getImageUrl(event.img);

  return (
    <Card hoverable className="overflow-hidden flex flex-col group h-full">
      {/* Event Thumbnail */}
      <div className="h-48 w-full bg-bg-light relative overflow-hidden border-b border-border/60">
        {event.img ? (
          <img
            src={imageUrl}
            alt={event.title}
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
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5 min-h-[1.75rem]">
          <Badge variant="neutral" size="sm">
            {event.type}
          </Badge>
          {Array.isArray(event.branch) ? (
            event.branch.map((b, idx) => (
              <Badge
                key={idx}
                variant={b === "دخترانه" ? "pink" : "info"}
                size="sm"
              >
                شعبه {b}
              </Badge>
            ))
          ) : (
            event.branch && (
              <Badge
                variant={event.branch === "دخترانه" ? "pink" : "info"}
                size="sm"
              >
                شعبه {event.branch}
              </Badge>
            )
          )}
        </div>

        {/* Title */}
        <h2 className="text-base md:text-lg font-bold text-secondary line-clamp-2 leading-[1.4] min-h-[2.8em] mb-1">
          {event.title}
        </h2>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2.5">
          <CalendarTodayIcon fontSize="inherit" />
          <span>{event.date}</span>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm text-text-secondary line-clamp-3 mb-4 flex-grow leading-relaxed">
          {event.description}
        </p>

        {/* Action Toolbar */}
        <div className="flex justify-end items-center gap-1 mt-auto pt-3 border-t border-border-light">
          <Button
            variant="info-ghost"
            size="icon-sm"
            onClick={() => onEdit(event._id)}
            title="ویرایش"
          >
            <EditIcon fontSize="small" />
          </Button>

          <Button
            variant="danger-ghost"
            size="icon-sm"
            onClick={() => onDelete(event._id)}
            title="حذف"
          >
            <DeleteOutlineIcon fontSize="small" />
          </Button>
        </div>
      </div>
    </Card>
  );
}