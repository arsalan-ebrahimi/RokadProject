import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './Routes';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        containerStyle={{
          top: 20,
        }}
        toastOptions={{
          style: {
            direction: "rtl",
            fontFamily: "var(--font-sans, 'IRANSansX', 'Vazirmatn', sans-serif)",
          },
        }}
      />
    </>
  );
}