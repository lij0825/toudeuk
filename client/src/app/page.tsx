import Link from "next/link";
import HomeIcon from "./componnents/HomeIcon";

export default function Home() {
  return (
    <>
      <div className="p-td flex flex-col justify-center w-full h-full min-h-screen">
        <HomeIcon />
        <h1 className="typo-title">터득</h1>
        <h1 className="typo-title">TouDeuk</h1>
        <Link href={"/login"}>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </Link>
      </div>
    </>
  );
}
