// ==========================================
// Component: CommentCard
// Presentation card for testimonials displaying author avatar, role badge, and quote text
// ==========================================

import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { Card, Badge, Button } from "../../../Components/UI";

/**
 * Card displaying individual user comment / testimonial with edit and delete triggers.
 * @param {Object} props
 * @param {Object} props.comment - Comment data entity
 * @param {Function} props.onEdit - Edit trigger callback
 * @param {Function} props.onDelete - Delete trigger callback
 */
export default function CommentCard({ comment, onEdit, onDelete }) {
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "معلم":
        return "info";
      case "مدیر مدرسه":
      case "مدیر":
        return "primary";
      case "معاون":
      case "مشاور":
        return "purple";
      case "اولیا":
      case "پدر دانش‌آموز":
      case "مادر دانش‌آموز":
        return "success";
      case "دانش‌آموز":
      case "دانش آموز":
        return "warning";
      default:
        return "neutral";
    }
  };

  const avatarUrl = getImageUrl(comment.img);

  return (
    <Card hoverable className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Content details */}
      <div className="flex flex-col gap-2 flex-grow min-w-0">
        {/* Header containing Avatar, Name, Role */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 text-secondary font-bold min-w-0">
            <img
              src={avatarUrl}
              alt={comment.author}
              className="w-10 h-10 object-cover rounded-full border border-border shadow-2xs shrink-0"
            />
            <span className="text-sm md:text-base line-clamp-1">{comment.author}</span>
          </div>

          <Badge variant={getRoleBadgeVariant(comment.role)} size="sm">
            {comment.role}
          </Badge>
        </div>

        {/* The comment text */}
        <p className="text-xs md:text-sm text-text-secondary leading-relaxed mt-1 line-clamp-3 break-words overflow-hidden">
          {comment.content}
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-1 self-end md:self-center shrink-0">
        <Button
          variant="info-ghost"
          size="icon-sm"
          onClick={() => onEdit(comment._id)}
          title="ویرایش"
        >
          <EditIcon fontSize="small" />
        </Button>

        <Button
          variant="danger-ghost"
          size="icon-sm"
          onClick={() => onDelete(comment._id)}
          title="حذف"
        >
          <DeleteOutlineIcon fontSize="small" />
        </Button>
      </div>
    </Card>
  );
}