import Link from "next/link";
import Button from "./components/Button";
import CurrentRank from "./components/CurrentRank";

export default function Toudeuk() {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <div className="flex flex-col items-center justify-center flex-grow">
        <CurrentRank rank={7} />
        <Button />
      </div>
      <div className="flex justify-center w-full mt-auto mb-4">
        <Link href={"/mypage"}>
          <button
            className="bg-transparent text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition transform hover:scale-110"
            aria-label="Scroll to top and go to MyPage"
          >
            마이페이지
          </button>
        </Link>
      </div>
    </div>
  );
}
