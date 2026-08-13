import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './Routes';
import { Toaster } from 'react-hot-toast';
import { CssBaseline, ThemeProvider } from '@mui/material';


export default function App() {
  console.log(new Date())
  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}