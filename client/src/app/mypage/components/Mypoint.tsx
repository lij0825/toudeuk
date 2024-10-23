'use client'
import { useRouter } from "next/navigation";



export default function Mypoint() {

  const router = useRouter();

  

  function NeonCard() {
    return (
      <div className="flex items-center justify-center bg-[#202020]">
        {/* Custom Card */}
        <div className="min-w-[390px] w-full max-w-2xl aspect-video relative overflow-hidden rounded-xl bg-gradient-to-br from-[#202020] to-[#2a2a2a] shadow-xl">
          {/* Neon glow background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ff8880] to-[#ff00ff80] opacity-30 blur-xl"></div>
          {/* Card content */}
          <div className="relative z-10 flex flex-col items-start justify-end h-full p-6 bg-[#ffffff10] backdrop-blur-sm border border-[#ffffff30] rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-2">내 포인트</h2>
            <p className="text-[#ffffffcc] text-sm mb-4">300pt</p>
            <button onClick={() => {
    router.push("/point");
  }
}> 내 포인트 이동</button>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div>
      <NeonCard />
    </div>
  );
}
