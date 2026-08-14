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
import EventCard from "../EventCard"; 
import Notify from "../../../Utils/notify";
import Confirm from "../../../Utils/Confirm"; // Custom SweetAlert2

// ==========================================
// Component: EventPage
// Description: Manages and displays the list of school events
// ==========================================
export default function EventPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------
  // Fetch Events Data on Mount
  // ----------------------------------------
  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      const data = await fetchData("event");
      
      if (data && data.success !== false) {
        setEvents(Array.isArray(data) ? data : data.data || []);
      } else {
        console.error("Failed to fetch events:", data?.message);
      }
      setLoading(false);
    };

    getEvents();
  }, []);

  // ----------------------------------------
  // Action Handlers
  // ----------------------------------------
  const handleEditEvent = (id) => {
    if (id) navigate(`update/${id}`); 
  };

  const handleAddEvent = () => navigate("create");

  const handleDeleteEvent = async (id) => {
    const isConfirmed = await Confirm(
      "آیا از حذف این رویداد اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است و تصویر آن نیز پاک خواهد شد.",
      "بله، حذف کن"
    );
    
    // Stop if user cancels
    if (!isConfirmed) return; 

    // Execute DELETE request (Backend handles image deletion)
    const deleteData = await fetchData(`event/${id}`, {
      method: "DELETE",
    });

    if (deleteData && deleteData.success !== false) {
      setEvents((prevEvents) => prevEvents.filter((item) => item._id !== id));
      Notify("success", "رویداد با موفقیت حذف شد.");
    } else {
      Notify("error", deleteData?.message || "خطا در حذف رویداد");
    }
  };
  
  // ----------------------------------------
  // Render Components
  // ----------------------------------------
  const renderedEventCards = [...events].reverse().map((event) => (
    <EventCard 
      key={event._id} 
      event={event} 
      onEdit={handleEditEvent} 
      onDelete={handleDeleteEvent} 
    />
  ));

  return (
    <div dir="rtl" className="p-8 w-full bg-gray-50 min-h-screen">
      
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-[#1b234d]">مدیریت رویدادها</h1>
        <button
          className="flex items-center gap-2 bg-[#51b5a5] hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={handleAddEvent}
        >
          <AddIcon />
          <span>افزودن رویداد</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 mt-10">در حال دریافت اطلاعات...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {renderedEventCards}

          {events.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              هیچ رویدادی یافت نشد.
            </div>
          )}
        </div>
      )}
    </div>
  );
}