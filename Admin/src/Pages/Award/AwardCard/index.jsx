// ==========================================
// Component: AwardCard
// Presentation card for school awards featuring rank badge styling (1st, 2nd, 3rd) and action buttons
// ==========================================

import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Card, Button } from "../../../Components/UI";

/**
 * Card displaying individual award rank, title, and action buttons.
 * @param {Object} props
 * @param {Object} props.award - Award entity data
 * @param {Function} props.onEdit - Edit trigger callback
 * @param {Function} props.onDelete - Delete trigger callback
 */
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
    <Card hoverable className="p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4">
      {/* Award Information */}
      <div className="flex items-center gap-3 sm:gap-4 flex-grow min-w-0">
        {/* Dynamic Rank Circle */}
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl text-base sm:text-lg font-black border shrink-0 shadow-xs ${rankDetails.bg}`}
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
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-secondary line-clamp-1 leading-[1.4] min-h-[1.4em] break-words">
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
          className="min-w-[40px] min-h-[40px]"
          onClick={() => onEdit(award._id)}
          title="ویرایش"
          aria-label="ویرایش جایزه"
        >
          <EditIcon fontSize="small" />
        </Button>

        <Button
          variant="danger-ghost"
          size="icon-sm"
          className="min-w-[40px] min-h-[40px]"
          onClick={() => onDelete(award._id)}
          title="حذف"
          aria-label="حذف جایزه"
        >
          <DeleteOutlineIcon fontSize="small" />
        </Button>
      </div>
    </Card>
  );
}