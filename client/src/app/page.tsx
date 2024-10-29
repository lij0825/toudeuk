// import { Suspense } from "react";
// import dynamic from "next/dynamic";
import Login from "./componnents/Login";
// HomeIcon을 동적으로 import하여 에러 격리
// const HomeIcon = dynamic(() => import("./componnents/HomeIcon"), {
//   loading: () => <div>Loading icon...</div>,
//   ssr: false,
// });

export default function Home() {
  return (
    <div className="p-td flex flex-col justify-center w-full h-full min-h-screen relative">
      {/* HomeIcon을 배경에 위치 */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {/* <Suspense fallback={<div>Loading...</div>}>
          <HomeIcon />
        </Suspense> */}
      </div>

      {/* Login을 그 위에 배치 */}
      <div className="relative z-10">
        <Login />
      </div>
    </div>
  );
}
