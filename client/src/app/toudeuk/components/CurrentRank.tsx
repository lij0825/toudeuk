export default function CurrentRank({ rank }: { rank: number }) {
  return (
    <div className="flex items-center justify-center">
      <div className="min-w-[150px] w-full max-w-sm h-[100px] relative overflow-hidden rounded-xl bg-gradient-to-br from-[#202020] to-[#2a2a2a] shadow-xl">
        {/* Neon glow background */}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 bg-[#ffffff10] backdrop-blur-sm border border-[#ffffff30] rounded-xl">
          <h2 className="text-xl font-bold text-white mb-1">현재 랭킹</h2>
          <p className="text-[#ffffffcc] text-lg">{rank}</p>
        </div>
      </div>
    </div>
  );
}
