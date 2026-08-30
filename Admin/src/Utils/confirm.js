import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

/**
 * Utility: Custom Confirmation Dialog
 * Renders a unified, professional SweetAlert2 modal using project design tokens
 */
const confirm = async (
  title = "آیا اطمینان دارید؟",
  text = "این عملیات غیرقابل بازگشت است.",
  confirmText = "بله، حذف کن",
  icon = "warning",
  confirmColor = "#ef4444"
) => {
  const result = await MySwal.fire({
    title: `<h3 class="font-extrabold text-secondary text-lg md:text-xl mt-2 font-sans">${title}</h3>`,
    html: `<p class="text-text-secondary font-medium text-sm mt-1 leading-relaxed font-sans">${text}</p>`,
    icon: icon,
    iconColor: confirmColor,
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: "var(--color-bg-light, #f4f6f8)",
    confirmButtonText: confirmText,
    cancelButtonText: "<span class='text-text-primary font-bold font-sans'>انصراف</span>",
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      popup: "!rounded-2xl !p-6 !shadow-xl !border !border-border !bg-surface font-sans",
      confirmButton:
        "!font-bold !rounded-xl !px-6 !py-2.5 !shadow-sm !transition-all !outline-none !text-white !cursor-pointer font-sans",
      cancelButton:
        "!font-bold !rounded-xl !px-6 !py-2.5 !border !border-border !bg-surface hover:!bg-surface-hover !transition-all !outline-none !cursor-pointer font-sans",
    },
    showClass: {
      popup: "swal2-show animate-fadeIn",
    },
    hideClass: {
      popup: "swal2-hide",
    },
  });

  return result.isConfirmed;
};

export default confirm;