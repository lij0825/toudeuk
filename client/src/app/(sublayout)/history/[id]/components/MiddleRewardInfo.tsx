import Image from "next/image";
import { GameUserInfo } from "@/types";
import { useRef, useEffect } from "react";

interface MiddleRewardInfoProps {
  users: GameUserInfo[];
}

export default function MiddleRewardInfo({ users }: MiddleRewardInfoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isAutoScrolling = useRef(true);

  const handleMouseDown = (e: React.MouseEvent) => {
    isAutoScrolling.current = false; // 드래그 중 자동 스크롤 중지
    isDragging.current = true;
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeft.current = containerRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    isAutoScrolling.current = true; // 드래그 종료 후 자동 스크롤 재개
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollSpeed = 1;
    const maxScroll = 900;

    const autoScroll = setInterval(() => {
      if (isAutoScrolling.current) {
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += scrollSpeed;
        }
      }
    }, 20);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <div
      className="overflow-x-auto flex space-x-2 py-2 scrollbar-hidden cursor-grab"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      style={{ userSelect: "none" }}
    >
      {users.length > 0 ? (
        [...users, ...users].map((user, index) => (
          <div
            key={user.nickname + index}
            className="flex-shrink-0 flex items-center p-2 border border-gray-300 rounded-md min-w-[180px]"
          >
            <Image
              src={user.profileImg}
              alt={`${user.nickname}'s profile`}
              width={40}
              height={40}
              className="rounded-full mr-3"
            />
            <div>
              <div className="font-medium text-gray-800 text-sm">
                {user.nickname}
              </div>
              <div className="text-xs text-gray-600">
                Click Count: {user.clickCount}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex-shrink-0 p-2 text-gray-500">No data available</div>
      )}
    </div>
  );
}
