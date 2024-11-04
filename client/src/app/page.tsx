import { Suspense } from "react";
import dynamic from "next/dynamic";
import Login from "./componnents/Login";

export default function Home() {
  return (
    <div className="p-8 flex flex-col justify-center w-full h-full min-h-screen relative">
      <div className="text-white">
        <h1 className="typo-title font-[120px]">터득</h1>
        <h1 className="typo-title">TouDeuk</h1>
        <Login />
      </div>
    </div>
  );
}
