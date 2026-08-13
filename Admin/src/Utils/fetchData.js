const fetchData = async (url, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    const headers = { ...options.headers };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(import.meta.env.VITE_API_URL + url, {
      ...options,
      headers: headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export default fetchData;