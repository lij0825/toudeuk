"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { ToastContainer, ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {},
  });
  // toastMessage
  const toastConfig: ToastContainerProps = {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: false,
    draggable: true,
    pauseOnHover: true,
    theme: "light",
    style: { zIndex: 9999 },
  };
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer {...toastConfig} />
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
