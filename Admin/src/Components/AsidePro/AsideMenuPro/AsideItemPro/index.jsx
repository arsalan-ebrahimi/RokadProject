// ------------------------------------------------------------------
// Submenu Item Component
// ------------------------------------------------------------------
export function AsideItemPro({ title, onClick }) {
  return (
    <p
      onClick={onClick}
      className="text-[14px] font-medium py-2 px-3 cursor-pointer text-right text-gray-600 rounded-lg transition-all duration-200 hover:bg-teal-50 hover:text-[#51b5a5]"
    >
      {title}
    </p>
  );
}