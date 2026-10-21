// ==========================================
// Component: StudentCard
// Presentation card displaying student profile, generation badge, current job, and external portfolio links
// Fully responsive with aspect-ratio thumbnail and >=40px touch targets
// ==========================================

import React from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LinkIcon from "@mui/icons-material/Link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { Card, Badge, Button } from "../../../Components/UI";

/**
 * Card component for displaying student summary and social links.
 * @param {Object} props
 * @param {Object} props.student - Student entity data
 * @param {Function} props.onEdit - Edit trigger callback
 * @param {Function} props.onDelete - Delete trigger callback
 */
export default function StudentCard({ student, onEdit, onDelete }) {
  const navigate = useNavigate();
  const imageUrl = getImageUrl(student.img);

  return (
    <Card hoverable className="overflow-hidden flex flex-col group h-full">
      {/* Student Thumbnail */}
      <div className="h-48 w-full bg-bg-light relative overflow-hidden flex items-center justify-center border-b border-border/60 aspect-video">
        {student.img ? (
          <img
            src={imageUrl}
            alt={student.fullName}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = "flex";
              }
            }}
          />
        ) : null}

        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-text-muted bg-bg-light"
          style={{ display: student.img ? "none" : "flex" }}
        >
          <PersonOutlineIcon fontSize="large" />
          <span className="text-xs mt-1 font-medium">بدون تصویر</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow min-h-0">
        <div className="flex items-center gap-2 mb-2.5 min-h-[1.5rem] max-h-[1.5rem] shrink-0">
          <Badge variant="indigo" size="sm">
            نسل {student.generation}
          </Badge>
          {student.currentCity && (
            <span className="text-[11px] text-text-muted">
              {student.currentCity}
            </span>
          )}
        </div>

        <h2 className="text-base md:text-lg font-bold text-secondary line-clamp-1 leading-[1.4] min-h-[1.4em] mb-1 break-words">
          {student.fullName}
        </h2>

        <p className="text-xs md:text-sm text-text-secondary font-medium mb-3 line-clamp-2 leading-[1.4] min-h-[2.8em] break-words overflow-hidden">
          {student.job}
        </p>

        {/* Social Links */}
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[2rem] max-h-[3.75rem] overflow-y-auto hide-scrollbar items-start content-start">
          {student.socialLinks &&
            student.socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-info-text bg-info-light border border-info-border px-2 py-0.5 rounded-lg hover:bg-info-border/30 transition-colors"
              >
                <LinkIcon fontSize="inherit" />
                <span>{social.type}</span>
              </a>
            ))}
        </div>

        {/* Card Actions with >=40px touch targets */}
        <div className="flex justify-between items-center gap-1 mt-auto shrink-0 pt-3 border-t border-border-light">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/student/${student._id}`)}
            icon={<VisibilityIcon fontSize="inherit" />}
            className="text-xs text-primary hover:text-primary-active min-h-[40px]"
          >
            مشاهده پرونده
          </Button>

          <div className="flex items-center gap-1">
            <Button
              variant="info-ghost"
              size="icon-sm"
              onClick={() => onEdit(student._id)}
              title="ویرایش"
              aria-label="ویرایش دانش‌آموز"
              className="min-h-[40px] min-w-[40px]"
            >
              <EditIcon fontSize="small" />
            </Button>

            <Button
              variant="danger-ghost"
              size="icon-sm"
              onClick={() => onDelete(student._id)}
              title="حذف"
              aria-label="حذف دانش‌آموز"
              className="min-h-[40px] min-w-[40px]"
            >
              <DeleteOutlineIcon fontSize="small" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}