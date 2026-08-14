
export const getImageUrl = (imageName) => {
  if (!imageName) return "/default-avatars/default-avatar-5.png";

  if (imageName.startsWith("default-")) {
    return `/default-avatars/${imageName}`;
  }

  const baseUrl = import.meta.env.VITE_FILE_URL || "http://localhost:1337";
  
  const cleanUrl = `${baseUrl}/Public/${imageName}`.replace(/([^:]\/)\/+/g, "$1");
  return cleanUrl;
};