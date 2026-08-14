// ==========================================
// Dependencies & Libraries
// ==========================================
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Initialize SweetAlert with React content support
const MySwal = withReactContent(Swal);

// ==========================================
// Utility: Custom Confirmation Dialog
// Description: Replaces native window.confirm with a beautiful SweetAlert2 modal
// ==========================================
const Confirm = async (
  title = "آیا اطمینان دارید؟",
  text = "این عملیات غیرقابل بازگشت است.",
  confirmText = "بله، مطمئنم",
  icon = "warning",       
  confirmColor = "#ef4444" 
) => {
  // Render and await user interaction
  const result = await MySwal.fire({
    title: `<h3 class="font-black text-[#1A2B4C] text-xl mt-2">${title}</h3>`,
    html: `<p class="text-gray-500 font-medium text-sm mt-1">${text}</p>`,
    icon: icon,
    iconColor: confirmColor,
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: "#f3f4f6", 
    confirmButtonText: confirmText,
    cancelButtonText: "<span class='text-gray-700'>انصراف</span>",
    reverseButtons: true,
    
    // Custom Tailwind-like styling classes
    customClass: {
      popup: "rounded-[2rem] p-4 shadow-xl border border-gray-100",
      confirmButton: "font-bold rounded-xl px-6 py-2.5 shadow-sm transition-colors outline-none text-white",
      cancelButton: "font-bold rounded-xl px-6 py-2.5 hover:bg-gray-200 transition-colors outline-none",
    },
    
    // Custom animations (requires animate.css if used)
    showClass: {
      popup: "animate__animated animate__fadeInUp animate__faster",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutDown animate__faster",
    },
  });

  // Returns true if user clicks 'Confirm', otherwise false
  return result.isConfirmed;
};

export default Confirm;