import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Card, Button } from "../../../Components/UI";

export default function AwardCard({ award, onEdit, onDelete }) {
  const getRankDetails = (rank) => {
    switch (Number(rank)) {
      case 1:
        return {
          bg: "bg-amber-50 text-amber-600 border-amber-300",
          iconColor: "text-amber-500",
          label: "مقام اول",
          badge: "۱",
        };
      case 2:
        return {
          bg: "bg-slate-100 text-slate-600 border-slate-300",
          iconColor: "text-slate-500",
          label: "مقام دوم",
          badge: "۲",
        };
      case 3:
        return {
          bg: "bg-orange-50 text-orange-600 border-orange-300",
          iconColor: "text-orange-500",
          label: "مقام سوم",
          badge: "۳",
        };
      default:
        return {
          bg: "bg-info-light text-info border-info-border",
          iconColor: "text-info",
          label: `مقام ${rank || "-"}`,
          badge: rank || "-",
        };
    }
  };

  const rankDetails = getRankDetails(award.rank);

  return (
    <Card hoverable className="p-4 flex items-center justify-between gap-4">
      {/* Award Information */}
      <div className="flex items-center gap-4 flex-grow min-w-0">
        {/* Dynamic Rank Circle */}
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-2xl text-lg font-black border shrink-0 shadow-xs ${rankDetails.bg}`}
          title={rankDetails.label}
        >
          {rankDetails.badge}
        </div>

        {/* Title and Description */}
        <div className="flex flex-col gap-0.5 flex-grow min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-text-muted">
              {rankDetails.label}
            </span>
          </div>
          <h2 className="text-base md:text-lg font-bold text-secondary line-clamp-1 leading-[1.4] min-h-[1.4em] break-words">
            {award.title}
          </h2>
          {award.description && (
            <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed min-h-[1.4em] break-words overflow-hidden">
              {award.description}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="info-ghost"
          size="icon-sm"
          onClick={() => onEdit(award._id)}
          title="ویرایش"
        >
          <EditIcon fontSize="small" />
        </Button>

        <Button
          variant="danger-ghost"
          size="icon-sm"
          onClick={() => onDelete(award._id)}
          title="حذف"
        >
          <DeleteOutlineIcon fontSize="small" />
        </Button>
      </div>
    </Card>
  );
}