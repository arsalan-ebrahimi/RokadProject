import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import AsidePro from "../Components/AsidePro";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";


export default function Layout() {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to={"/auth"} />;
  }
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden", // جلوگیری از اسکرول خوردن کل صفحه
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: "auto",
          height: "100%",
        }}
      >
        <Outlet />
      </Box>

      {/* Aside */}
      <AsidePro />
    </Box>
  );
}
