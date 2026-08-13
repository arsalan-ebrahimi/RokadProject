import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../Layout";
import Home from "../Pages/Home";
import Enrollment from "../Pages/Enrollment";
import Blog from "../Pages/Blog";
import BlogPage from "../Pages/Blog/BlogPage";
import CreateBlog from "../Pages/Blog/CreateBlog";
import UpdateBlog from "../Pages/Blog/UpdateBlog";
import EnrollmentPage from "../Pages/Enrollment/EnrollmentPage";
import UpdateEnrollment from "../Pages/Enrollment/UpdateEnrollment";
import Award from "../Pages/Award";
import AwardPage from "../Pages/Award/AawardPage";
import UpdateAward from "../Pages/Award/UpdateAward";
import CreateAward from "../Pages/Award/CreateAward";
import CommentPage from "../Pages/Comment/CommentPage";
import CreateComment from "../Pages/Comment/CreateComment";
import CommentLayout from "../Pages/Comment";
import UpdateComment from "../Pages/Comment/UpdateComment";
import Auth from "../Pages/Auth";
import NotFound from "../Pages/NotFound"

/**
 * Main Application Router configuration
 */
const router = createBrowserRouter([
  {
    /* Auth route is separate from the main layout */
    path: "/auth",
    element: <Auth />,
  },
  {
    /* Main Dashboard Layout */
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        /* Blog Management Section */
        path: "blog",
        element: <Blog />,
        children: [
          { index: true, element: <BlogPage /> },
          { path: "create", element: <CreateBlog /> },
          { path: "update/:id", element: <UpdateBlog /> },
        ],
      },
      {
        /* Enrollment Management Section */
        path: "enrollment",
        element: <Enrollment />,
        children: [
          { index: true, element: <EnrollmentPage /> },
          { path: "update/:id", element: <UpdateEnrollment /> },
        ],
      },
      {
        /* Awards & Honors Section */
        path: "award",
        element: <Award />,
        children: [
          { index: true, element: <AwardPage /> },
          { path: "create", element: <CreateAward /> },
          { path: "update/:id", element: <UpdateAward /> },
        ],
      },
      {
        /* Comments Management Section */
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
    /* Fallback for unknown paths - redirect to login or dashboard */
    path: "*",
    element: <NotFound/>,
  },
]);

export default router;