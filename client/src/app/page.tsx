"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// HomeIcon을 동적으로 import하여 에러 격리
const HomeIcon = dynamic(() => import("./componnents/HomeIcon"), {
  loading: () => <div>Loading icon...</div>,
  ssr: false,
});

export default function Home() {
  return (
    <div className="p-td flex flex-col justify-center w-full h-full min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <HomeIcon />
      </Suspense>

      <h1 className="typo-title">터득</h1>
      <h1 className="typo-title">TouDeuk</h1>
    </div>
  );
}
