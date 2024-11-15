import Image from "next/image";
import { useMemo, ReactElement } from "react";

// Props 인터페이스 정의
interface BackgroundProps {
  className?: string;
}

// 함수 선언식으로 정의된 Background 컴포넌트
function Background({ className }: BackgroundProps): ReactElement {
  const backgroundImage = useMemo(
    () => (
      <Image
        src="/countryside.svg"
        alt="Background Image"
        width={500}
        height={200}
        className={`w-full absolute brightness-40 bottom-0 ${className ?? ""}`}
        priority
      />
    ),
    [className]
  );

  return backgroundImage;
}

export default Background;
