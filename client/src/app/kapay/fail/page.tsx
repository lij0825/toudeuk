"use client";

import { useRouter } from "next/navigation";

const KaPayFailPage = () => {
  const router = useRouter();
  const canCloseWindow = window.opener !== null && !window.opener.closed;
  const buttonStyle = "bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded font-noto";

  const handleRedirect = () => {
    router.push("/mypage");
  };

  return (
    <div
      className="flex flex-col items-center bg-white"
      style={{ minHeight: "100vh" }}
    >
      {/* Header Section */}
      <div className="w-full bg-gray-300 py-4 flex justify-center">
        <span className="maplestory text-2xl font-bold font-noto text-gray-800">
          터득 Toudeuk
        </span>
      </div>

      {/* Main Content */}
      <div
        className="font-noto flex flex-col items-center justify-center bg-white"
        style={{ height: "calc(100vh - 86px - 64px)" }}
      >
        <span className="maplestory text-4xl text-red-600">포인트 결제 실패</span>
        <div className="flex flex-row items-center my-10">
          <p className="font-bold">
            <span className="text-red-600 text-xl maplestory mr-1">포인트</span>
            결제 처리 중 오류가 발생하였습니다.
          </p>
        </div>
        {canCloseWindow ? (
          <button className={buttonStyle} onClick={() => window.close()}>
            닫기
          </button>
        ) : (
          <button className={buttonStyle} onClick={handleRedirect}>
            마이 페이지로
          </button>
        )}
      </div>
    </div>
  );
};

export default KaPayFailPage;
