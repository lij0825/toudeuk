"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import { ToastContainer, ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//const queryClient = new QueryClient()사용하지만 사실 이렇게 사용하면 문제가 되는 부분이 있다. 컴포넌트가 마운트될 때마다 새로운 QueryClient인스턴스가 생성되기 때문
export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      //useState를 사용하여 참조 동일성을 유지하며, 상태 관리를 조절하고 컴포넌트 렌더링과 상태 업데이트를 조절
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );
  // toastMessage
  const toastConfig: ToastContainerProps = {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: true, //진행바 숨김
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
      <ToastContainer {...toastConfig} limit={1} />
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
