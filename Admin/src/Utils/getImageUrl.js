
export const getImageUrl = (imageName) => {
  if (!imageName) return "/default-avatars/default-avatar-5.png";

  if (imageName.startsWith("default-")) {
    return `/default-avatars/${imageName}`;
  }

  const baseUrl = import.meta.env.VITE_FILE_URL || "http://localhost:5000";
  
  const cleanUrl = `${baseUrl}/${imageName}`.replace(/([^:]\/)\/+/g, "$1");
  return cleanUrl;
};