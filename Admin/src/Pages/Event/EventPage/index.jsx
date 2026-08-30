import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../../Utils/axiosInstance";
import EventCard from "../EventCard";
import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Filter from "../../../Components/Filter";
import Search from "../../../Components/Search";
import Loading from "../../../Components/Loading";
import { Button, PageHeader, Card } from "../../../Components/UI";

export default function EventPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  const LIMIT = 12;

  const eventFilterConfig = [
    {
      field: "branch",
      label: "شعبه",
      options: ["دخترانه", "پسرانه"],
    },
  ];

  const fetchEvents = async (pageNumber, query, currentFilters = {}) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let url = `event?limit=${LIMIT}&page=${pageNumber}&sort=-_id`;
      if (query) {
        url += `&q=${query}`;
      }

      Object.keys(currentFilters).forEach((key) => {
        if (currentFilters[key]) {
          url += `&${key}=${encodeURIComponent(currentFilters[key])}`;
        }
      });

      const data = await axiosInstance.get(url);

      if (data && data.success !== false) {
        const fetchedEvents = Array.isArray(data) ? data : data.data || [];

        if (fetchedEvents.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (pageNumber === 1) {
          setEvents(fetchedEvents);
        } else {
          setEvents((prev) => {
            const uniqueNewItems = fetchedEvents.filter(
              (newItem) =>
                !prev.some((existingItem) => existingItem._id === newItem._id)
            );
            return [...prev, ...uniqueNewItems];
          });
        }
      } else {
        Notify("error", data?.message || "خطا در دریافت اطلاعات");
      }
    } catch (error) {
      Notify("error", error.message || "خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEvents(page, searchQuery, filters);
  }, [page, searchQuery, filters]);

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

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
  };

  const handleEditEvent = (id) => {
    if (id) navigate(`update/${id}`);
  };

  const handleAddEvent = () => navigate("create");

  const handleDeleteEvent = async (id) => {
    const isConfirmed = await confirm(
      "آیا از حذف این رویداد اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است و تصویر آن نیز پاک خواهد شد.",
      "بله، حذف کن"
    );

    if (!isConfirmed) return;

    try {
      const deleteData = await axiosInstance.delete(`event/${id}`);

      if (deleteData && deleteData.success !== false) {
        setEvents((prevEvents) => prevEvents.filter((item) => item._id !== id));
        Notify("success", "رویداد با موفقیت حذف شد.");
      } else {
        Notify("error", deleteData?.message || "خطا در حذف رویداد");
      }
    } catch (error) {
      Notify("error", error.message || "خطا در حذف رویداد");
    }
  };

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="مدیریت رویدادها"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={handleAddEvent}
          >
            افزودن رویداد
          </Button>
        }
      >
        <Card className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 shadow-xs">
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter
              filterConfig={eventFilterConfig}
              onFilterChange={handleFilterChange}
            />
          </div>
          <Search onSearch={handleSearch} placeholder="جستجوی رویداد..." />
        </Card>
      </PageHeader>

      {/* Main Content Area */}
      {loading && page === 1 ? (
        <div className="flex justify-center mt-20">
          <Loading size={12} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>

          {events.length === 0 && !loading && (
            <div className="col-span-full text-center text-text-secondary py-14">
              هیچ رویدادی یافت نشد.
            </div>
          )}

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