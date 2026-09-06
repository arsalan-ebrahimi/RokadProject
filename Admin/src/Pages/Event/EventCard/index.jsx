// ==========================================
// Component: EventCard
// Presentation card for events displaying thumbnail, category/branch badges, date, and actions
// ==========================================

import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { Card, Badge, Button } from "../../../Components/UI";

/**
 * Card component presenting event details with action buttons.
 * @param {Object} props
 * @param {Object} props.event - Event entity data
 * @param {Function} props.onEdit - Callback when edit is triggered
 * @param {Function} props.onDelete - Callback when delete is triggered
 */
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
      <div className="p-4 flex flex-col flex-grow min-h-0">
        {/* Title */}
        <h2 className="text-base md:text-lg font-bold text-secondary line-clamp-2 leading-[1.4] min-h-[2.8em] mb-2 break-words">
          {event.title}
        </h2>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5 min-h-[1.75rem] max-h-[3.75rem] overflow-y-auto hide-scrollbar content-start">
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

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2.5 shrink-0">
          <CalendarTodayIcon fontSize="inherit" />
          <span>{event.date}</span>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm text-text-secondary line-clamp-2 md:line-clamp-3 leading-relaxed mb-4 min-h-[2.8em] break-words overflow-hidden">
          {event.description}
        </p>

        {/* Action Toolbar */}
        <div className="flex justify-end items-center gap-1 mt-auto shrink-0 pt-3 border-t border-border-light">
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