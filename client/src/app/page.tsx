import Login from "./components/Login";
// import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white p-8 flex flex-col justify-center w-full h-full min-h-screen relative">
      <div className="">
        <h1 className="typo-title font-[120px]">터득</h1>
        <h1 className="typo-title">TouDeuk</h1>
        <Login />
        {/* <Image
        src="/icons/Loading.gif"
        width={300}
        height={300}
        alt={`loading!`}
        unoptimized={true}
      /> */}
      </div>
    </div>
  );
}
