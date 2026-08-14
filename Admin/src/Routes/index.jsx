// ==========================================
// Dependencies
// ==========================================
import React from "react";
import { createBrowserRouter } from "react-router-dom";

// ==========================================
// Layouts & Static Pages
// ==========================================
import Layout from "../Layout";
import Auth from "../Pages/Auth";
import Home from "../Pages/Home";
import NotFound from "../Pages/NotFound";

// ==========================================
// Blog Components
// ==========================================
import Blog from "../Pages/Blog";
import BlogPage from "../Pages/Blog/BlogPage";
import CreateBlog from "../Pages/Blog/CreateBlog";
import UpdateBlog from "../Pages/Blog/UpdateBlog";

// ==========================================
// Event Components
// ==========================================
import EventLayout from "../Pages/Event";
import EventPage from "../Pages/Event/EventPage";
import CreateEvent from "../Pages/Event/CreateEvent";
import UpdateEvent from "../Pages/Event/UpdateEvent";

// ==========================================
// Student Components
// ==========================================
import StudentLayout from "../Pages/Student";
import StudentPage from "../Pages/Student/StudentPage";
import CreateStudent from "../Pages/Student/CreateStudent";
import UpdateStudent from "../Pages/Student/UpdateStudent";

// ==========================================
// Award Components
// ==========================================
import Award from "../Pages/Award";
import AwardPage from "../Pages/Award/AawardPage"; // Notice the spelling 'AawardPage' based on your previous code
import CreateAward from "../Pages/Award/CreateAward";
import UpdateAward from "../Pages/Award/UpdateAward";

// ==========================================
// Comment Components
// ==========================================
import CommentLayout from "../Pages/Comment";
import CommentPage from "../Pages/Comment/CommentPage";
import CreateComment from "../Pages/Comment/CreateComment";
import UpdateComment from "../Pages/Comment/UpdateComment";

// ==========================================
// Application Router Configuration
// ==========================================
const router = createBrowserRouter([
  {
    // Auth route is separate from the main layout
    path: "/auth",
    element: <Auth />,
  },
  {
    // Main Dashboard Layout
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        // Blog Management Section
        path: "blog",
        element: <Blog />,
        children: [
          { index: true, element: <BlogPage /> },
          { path: "create", element: <CreateBlog /> },
          { path: "update/:id", element: <UpdateBlog /> },
        ],
      },
      {
        // Event Management Section
        path: "event",
        element: <EventLayout />,
        children: [
          { index: true, element: <EventPage /> },
          { path: "create", element: <CreateEvent /> },
          { path: "update/:id", element: <UpdateEvent /> },
        ],
      },
      {
        // Student Management Section
        path: "student",
        element: <StudentLayout />,
        children: [
          { index: true, element: <StudentPage /> },
          { path: "create", element: <CreateStudent /> },
          { path: "update/:id", element: <UpdateStudent /> },
        ],
      },
      {
        // Awards & Honors Section
        path: "award",
        element: <Award />,
        children: [
          { index: true, element: <AwardPage /> },
          { path: "create", element: <CreateAward /> },
          { path: "update/:id", element: <UpdateAward /> },
        ],
      },
      {
        // Comments Management Section
        path: "comment",
        element: <CommentLayout />,
        children: [
          { index: true, element: <CommentPage /> },
          { path: "create", element: <CreateComment /> },
          { path: "update/:id", element: <UpdateComment /> },
        ],
      },
    ],
  },
  {
    // Fallback for unknown paths
    path: "*",
    element: <NotFound />,
  },
]);

export default router;