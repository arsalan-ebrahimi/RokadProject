// ==========================================
// Dependencies & Icons
// ==========================================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

// ==========================================
// Utilities & Components
// ==========================================
import fetchData from "../../../Utils/fetchData";
import AwardCard from "../AwardCard";
import Notify from "../../../Utils/notify";
import Confirm from "../../../Utils/Confirm";
import Loading from "../../../Components/Loading";

// ==========================================
// Component: AwardPage
// Description: Manages awards list with Infinite Scrolling
// ==========================================
export default function AwardPage() {
  const navigate = useNavigate();

  // ----------------------------------------
  // State Management
  // ----------------------------------------
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Since it's a vertical list (flex-col), 10 is a good limit
  const LIMIT = 10;

  // ----------------------------------------
  // Fetch Data Function
  // ----------------------------------------
  const fetchAwards = async (pageNumber) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    const data = await fetchData(
      `award?limit=${LIMIT}&page=${pageNumber}&sort=-_id`,
    );

    if (data && data.success !== false) {
      const fetchedAwards = Array.isArray(data) ? data : data.data || [];

      if (fetchedAwards.length < LIMIT) {
        setHasMore(false);
      }

      if (pageNumber === 1) {
        setAwards(fetchedAwards);
      } else {
        setAwards((prev) => {
          const uniqueNewItems = fetchedAwards.filter(
            (newItem) =>
              !prev.some((existingItem) => existingItem._id === newItem._id),
          );
          return [...prev, ...uniqueNewItems];
        });
      }
    } else {
      Notify("error", data?.message || "خطا در دریافت اطلاعات");
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchAwards(page);
  }, [page]);

  // ----------------------------------------
  // Infinite Scroll Listener
  // ----------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (hasMore && !loading && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadingMore]);

  // ----------------------------------------
  // Action Handlers
  // ----------------------------------------
  const handleEditAward = (id) => {
    if (id) navigate(`update/${id}`);
  };

  const handleAddAward = () => navigate("create");

  const handleDeleteAward = async (id) => {
    const isConfirmed = await Confirm(
      "آیا از حذف این جایزه اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است.",
      "بله، حذف کن",
    );

    if (!isConfirmed) return;

    const deleteData = await fetchData(`award/${id}`, { method: "DELETE" });

    if (deleteData && deleteData.success !== false) {
      setAwards((prev) => prev.filter((item) => item._id !== id));
      Notify("success", "جایزه با موفقیت حذف شد.");
    } else {
      Notify("error", deleteData?.message || "خطا در حذف اطلاعات");
    }
  };

  // ----------------------------------------
  // Render Component
  // ----------------------------------------
  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-[#1b234d]">
          مدیریت افتخارات و جوایز
        </h1>
        <button
          className="flex items-center gap-2 bg-[#51b5a5] hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={handleAddAward}
        >
          <AddIcon />
          <span>افزودن جایزه</span>
        </button>
      </div>

      {/* Initial Full Page Loading */}
      {loading && page === 1 ? (
        <div className="flex justify-center mt-20">
          <Loading size={12} />
        </div>
      ) : (
        <>
          {/* Main List */}
          <div className="flex flex-col gap-4">
            {awards.map((award) => (
              <AwardCard
                key={award._id}
                award={award}
                onEdit={handleEditAward}
                onDelete={handleDeleteAward}
              />
            ))}
          </div>

          {/* Empty State */}
          {awards.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-10">
              هیچ جایزه‌ای یافت نشد.
            </div>
          )}

          {/* Loading indicator for Infinite Scroll */}
          {loadingMore && (
            <div className="flex justify-center mt-8 py-4 pb-10">
              <Loading size={10} />
            </div>
          )}
        </>
      )}
    </div>
  );
}