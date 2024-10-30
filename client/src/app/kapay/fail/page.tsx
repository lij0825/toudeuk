import { useRouter } from "next/navigation";

const KaPayFailPage = () => {
  const router = useRouter();
  const canCloseWindow = window.opener !== null && !window.opener.closed;
  const bottonStyle = "bg-sub6 hover:bg-sub7";

  const handleRedirect = () => {
    router.push("/mypage");
  };

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ height: "calc(100vh - 86px)" }}
    >
      <span className="maplestory text-4xl text-sub9">포인트 결제 실패</span>
      <div className="flex flex-row items-center my-10">
        <p className="font-bold">
          <span className="text-sub2 text-xl maplestory mr-1">포인트</span>
          결제 처리 중 오류가 발생하였습니다.
        </p>
      </div>
      {canCloseWindow ? (
        <button className={bottonStyle} onClick={() => window.close()}>
          닫기
        </button>
      ) : (
        <button className={bottonStyle} onClick={handleRedirect}>
          마이 페이지로!
        </button>
      )}
    </div>
  );
};

export default KaPayFailPage;
