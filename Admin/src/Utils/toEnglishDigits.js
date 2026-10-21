// ==========================================
// Utility: toEnglishDigits
// Converts Persian/Arabic digits to standard English ASCII digits
// ==========================================

export const toEnglishDigits = (str) => {
  if (typeof str !== "string") return str;
  return str
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
};

export default toEnglishDigits;
