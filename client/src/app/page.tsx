"use client";

import Link from "next/link";
import { Suspense } from "react";

// HomeIcon을 동적으로 import하여 에러 격리
// const HomeIcon = dynamic(() => import("./componnents/HomeIcon"), {
//   loading: () => <div>Loading icon...</div>,
//   ssr: false, // 클라이언트 사이드에서만 렌더링
// });

export default function Home() {
  return (
    <div className="p-td flex flex-col justify-center w-full h-full min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>{/* <HomeIcon /> */}</Suspense>

      <h1 className="typo-title">터득</h1>
      <h1 className="typo-title">TouDeuk</h1>

      <Link href="/login">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Login
        </button>
      </Link>
    </div>
  );
}
