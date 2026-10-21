// ==========================================
// Page Component: EventPage (Event List)
// Displays paginated list of events with branch filtering (Boys/Girls), search, and undoable delete
// ==========================================

import React, { useState, useEffect, useRef } from "react";
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
import { useUndoableDelete } from "../../../Hooks";

/**
 * Event list page with branch filter, search, infinite scrolling, and undoable delete workflow.
 */
export default function EventPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const isFetchingRef = useRef(false);

  const LIMIT = 12;

  const eventFilterConfig = [
    {
      field: "branch",
      label: "شعبه",
      options: ["دخترانه", "پسرانه"],
    },
  ];

  // Undoable Delete Hook: manages 5s countdown window and optimistic UI filtering
  const {
    visibleItems: visibleEvents,
    requestDelete,
  } = useUndoableDelete({
    entity: "event",
    entityLabel: "رویداد",
    items: events,
    getId: (item) => item?._id,
    getLabel: (event) => event?.title || "",
    deleteFn: (id) => axiosInstance.delete(`event/${id}`),
    onDeleted: (id) => {
      setEvents((prevEvents) => prevEvents.filter((item) => item._id !== id));
    },
    duration: 5000,
  });

  const fetchEvents = async (pageNumber, query, currentFilters = {}) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);
    isFetchingRef.current = true;

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
        setHasMore(false);
        Notify("error", data?.message || "خطا در دریافت اطلاعات");
      }
    } catch (error) {
      setHasMore(false);
      Notify("error", error.message || "خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchEvents(page, searchQuery, filters);
  }, [page, searchQuery, filters]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loading || loadingMore || isFetchingRef.current) return;

      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

      if (scrollHeight > clientHeight + 100 && scrollTop > 60) {
        if (scrollTop + clientHeight >= scrollHeight - 160) {
          isFetchingRef.current = true;
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadingMore]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
    isFetchingRef.current = false;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
    isFetchingRef.current = false;
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

    requestDelete(id);
  };

  return (
    <div dir="rtl" className="p-4 sm:p-6 md:p-8 w-full bg-background min-h-dvh">
      <PageHeader
        title="مدیریت رویدادها"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={handleAddEvent}
            className="w-full sm:w-auto"
          >
            افزودن رویداد
          </Button>
        }
      >
        <Card className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 md:gap-4 p-3 sm:p-4 shadow-xs">
          <Filter
            filterConfig={eventFilterConfig}
            onFilterChange={handleFilterChange}
          />
          <Search onSearch={handleSearch} placeholder="جستجوی رویداد..." className="w-full md:w-80" />
        </Card>
      </PageHeader>

      {/* Main Content Area */}
      {loading && page === 1 ? (
        <div className="flex justify-center mt-20">
          <Loading size={12} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch">
            {visibleEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>

          {visibleEvents.length === 0 && !loading && (
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
