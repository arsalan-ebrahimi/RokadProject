import { useState, useEffect } from "react";

export const useFetchItems = (url=null) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL + url}`);
        const result = await response.json();
        setData(result?.data);
      } catch (error) {
        console?.error("Error fetching items:", error);
      }
    };

    fetchData();
  }, [url]);

  return data;
};
