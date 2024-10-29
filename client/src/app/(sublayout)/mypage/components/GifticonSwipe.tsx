
import Link from "next/link";
import GifticonItem from "./GifticonItem";

// 공통 스타일을 상수로 분리
export const CommonLinkStyle = {
  backgroundImage:
    "linear-gradient(to top left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 70%), linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 70%)",
  backdropBlur: "lg",
  boxShadow: "lg",
  border: "solid 0.5px",
  borderRadius: "lg",
  alignItems: "center",
  height : '180px'
};



export default function GifticonSwipe() {


  return (
    <>
      <div className="flex overflow-x-scroll [&::-webkit-scrollbar]:hidden">
        <Link
          href={`/mygifticon`}
          className="typo-sub-title p-4 border w-[350px] rounded-lg backdrop-blur-lg bg-white/30 shadow-lg mr-3 "
          style={CommonLinkStyle}
        >

          <div>My</div>
          <div>{`Gifticon >>`}</div>
        </Link>

        <GifticonItem/>

      </div>
    </>
  );
}
