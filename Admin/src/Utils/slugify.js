// ==========================================
// Utility: slugify
// Converts Persian/English titles to URL-safe SEO friendly slugs with length limit
// ==========================================

export const slugify = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\u06F0-\u06F9]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)])
    .replace(/[\u0660-\u0669]/g, (d) => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)])
    .replace(/\u200c|\u200d|\u200e|\u200f/g, "-")
    .replace(/[\s\t\n\r_+/\\.:,;!?()"'\[\]{}|<>*&^%$#@~`]+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150);
};

export default slugify;
