"use client";

//소켓 연결 또는 SSE 방식으로 touch값 fetch
import { useState } from "react";

export default function Button() {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  return (
    <>
      <button
        onClick={handleClick}
        className={`h-12 w-12 bg-[#dde1e7] rounded-md ${
          isClicked
            ? "shadow-[inset_-3px_-3px_7px_#ffffff73,inset_3px_3px_5px_rgba(94,104,121,0.288)]"
            : "shadow-[-3px_-3px_7px_#ffffff73,3px_3px_5px_rgba(94,104,121,0.288)]"
        }`}
      ></button>
    </>
  );
}
