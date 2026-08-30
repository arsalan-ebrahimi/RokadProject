import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../../Utils/axiosInstance";
import AwardCard from "../AwardCard";
import Notify from "../../../Utils/notify";
import confirm from "../../../Utils/confirm";
import Filter from "../../../Components/Filter";
import Search from "../../../Components/Search";
import Loading from "../../../Components/Loading";
import { Button, PageHeader, Card } from "../../../Components/UI";

export default function AwardPage() {
  const navigate = useNavigate();

  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  const LIMIT = 10;

  const awardFilterConfig = [
    {
      field: "rank",
      label: "مقام",
      options: [
        { label: "اول", value: 1 },
        { label: "دوم", value: 2 },
        { label: "سوم", value: 3 },
      ],
    },
  ];

  const fetchAwards = async (pageNumber, query, currentFilters = {}) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let url = `award?limit=${LIMIT}&page=${pageNumber}&sort=-_id`;
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
        const fetchedAwards = Array.isArray(data) ? data : data.data || [];

        if (fetchedAwards.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (pageNumber === 1) {
          setAwards(fetchedAwards);
        } else {
          setAwards((prev) => {
            const uniqueNewItems = fetchedAwards.filter(
              (newItem) =>
                !prev.some((existingItem) => existingItem._id === newItem._id)
            );
            return [...prev, ...uniqueNewItems];
          });
        }
      } else {
        Notify("error", data?.message || "خطا در دریافت اطلاعات", "award-fetch-error");
      }
    } catch (error) {
      Notify("error", error.message || "خطا در دریافت اطلاعات", "award-fetch-error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAwards(page, searchQuery, filters);
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

  const handleEditAward = (id) => {
    if (id) navigate(`update/${id}`);
  };

  const handleAddAward = () => navigate("create");

  const handleDeleteAward = async (id) => {
    const isConfirmed = await confirm(
      "آیا از حذف این جایزه اطمینان دارید؟",
      "این عمل غیرقابل بازگشت است.",
      "بله، حذف کن"
    );

    if (!isConfirmed) return;

    try {
      const deleteData = await axiosInstance.delete(`award/${id}`);

      if (deleteData && deleteData.success !== false) {
        setAwards((prev) => prev.filter((item) => item._id !== id));
        Notify("success", "جایزه با موفقیت حذف شد.", "award-delete-success");
      } else {
        Notify("error", deleteData?.message || "خطا در حذف اطلاعات", "award-delete-error");
      }
    } catch (error) {
      Notify("error", error.message || "خطا در حذف اطلاعات", "award-delete-error");
    }
  };

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="مدیریت افتخارات و جوایز"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<AddIcon fontSize="small" />}
            onClick={handleAddAward}
          >
            افزودن جایزه
          </Button>
        }
      >
        <Card className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 shadow-xs">
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter
              filterConfig={awardFilterConfig}
              onFilterChange={handleFilterChange}
            />
          </div>
          <Search onSearch={handleSearch} placeholder="جستجوی افتخارات..." />
        </Card>
      </PageHeader>

      {/* Main List */}
      {loading && page === 1 ? (
        <div className="flex justify-center mt-20">
          <Loading size={12} />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {awards.map((award) => (
              <AwardCard
                key={award._id}
                award={award}
                onEdit={handleEditAward}
                onDelete={handleDeleteAward}
              />
            ))}
          </div>

          {awards.length === 0 && !loading && (
            <div className="text-center text-text-secondary py-14">
              هیچ جایزه‌ای یافت نشد.
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
