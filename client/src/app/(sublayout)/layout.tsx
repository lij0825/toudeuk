import React from "react";
import BackButton from "../components/Backbutton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bottom-sheet relative">
      {/* 우측 상단에 위치한 BackButton */}
      <div className="absolute top-10 right-8">
        <BackButton />
      </div>
      {children}
    </div>
  );
}
