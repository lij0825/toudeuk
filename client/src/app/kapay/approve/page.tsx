"use client";

import { useRouter } from "next/navigation";

const KaPayApprovePage = () => {
  const router = useRouter();
  const canCloseWindow = window.opener !== null && !window.opener.closed;
  const buttonStyle = "bg-sub6 hover:bg-sub7";

  const handleRedirect = () => {
    router.push("/mypage");
  };

  return (
    <div
      className="flex flex-col items-center justify-center bg-white"
      style={{ height: "calc(100vh - 86px)" }}
    >
      <span className="maplestory text-4xl text-sub2">결제 완료</span>
      <div className="flex flex-row items-center my-10">
        <p className="font-bold">
          <span className="text-sub2 text-xl maplestory mr-1">포인트</span>
          충전이 완료되었습니다.
        </p>
      </div>
      {canCloseWindow ? (
        <button className={buttonStyle} onClick={() => window.close()}>
          닫기
        </button>
      ) : (
        <button className={buttonStyle} onClick={handleRedirect}>
          마이 페이지로!
        </button>
      )}
    </div>
  );
};

export default KaPayApprovePage;
