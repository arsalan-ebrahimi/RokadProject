import React, { useState, useEffect } from "react";
import fetchData from "../../../Utils/fetchData"; 
import AwardCard from "../AwardCard"; 
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Notify from "../../../Utils/notify";

export default function AwardPage() {
  const navigate = useNavigate();
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all awards from server
  useEffect(() => {
    const getAwards = async () => {
      setLoading(true);
      
      const data = await fetchData("award");
      
      if (data && data.success !== false) { 
        setAwards(Array.isArray(data) ? data : data.data || []);
      } else {
        console.error("Failed to fetch awards:", data?.message);
      }
      setLoading(false);
    };

    getAwards();
  }, []);

  // Handle redirection to update page
  const handleEditAward = (id) => {
    if (id) {
      navigate(`update/${id}`); 
    }
  };

  // Handle redirection to creation page
  const handleAddAward = () => {
    navigate("create");
  };

  // Handle award deletion with confirmation
  const handleDeleteAward = async (id) => {
    const isConfirmed = window.confirm("آیا از حذف این جایزه اطمینان دارید؟ این عمل غیرقابل بازگشت است.");
    
    if (!isConfirmed) return; 

    const deleteData = await fetchData(`award/${id}`, {
      method: "DELETE",
    });

    if (deleteData && deleteData.success !== false) {
      setAwards((prevAwards) => prevAwards.filter((item) => item._id !== id));
      Notify("success", "جایزه با موفقیت حذف شد.");
    } else {
      Notify("error", deleteData?.message || "خطا در حذف اطلاعات");
    }
  };
  
  // Render list of AwardCard components in reverse order
  const renderedAwardCards = [...awards].reverse().map((award) => (
    <AwardCard 
      key={award._id} 
      award={award} 
      onEdit={handleEditAward} 
      onDelete={handleDeleteAward} 
    />
  ));

  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      
      {/* Header with Page Title and Add Button */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-[#1b234d]">مدیریت افتخارات و جوایز</h1>
        <button
          className="flex items-center gap-2 bg-[#51b5a5] hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={handleAddAward}
        >
          <AddIcon />
          <span>افزودن جایزه</span>
        </button>
      </div>

      {/* Loading state or Awards list */}
      {loading ? (
        <div className="text-center text-gray-500 mt-10">در حال دریافت اطلاعات...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {renderedAwardCards}

          {/* Empty state message */}
          {awards.length === 0  && (
            <div className="text-center text-gray-500 py-10">
              هیچ جایزه‌ای یافت نشد.
            </div>
          )}
        </div>
      )}
    </div>
  );
}