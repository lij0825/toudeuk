import { Suspense } from "react";
import dynamic from "next/dynamic";
import Login from "./componnents/Login";

export default function Home() {
  return (
    <div className="p-td flex flex-col justify-center w-full h-full min-h-screen relative">
      <div className="relative z-10">
        <Login />
      </div>
    </div>
  );
}
