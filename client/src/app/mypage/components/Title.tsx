import LottieAnimation from "@/app/components/LottieAnimation";
import { CUSTOM_LETTER } from "@/constants/tudeukLetter";

export default function Title() {
  const letters = "toudeuk";

  return (
<div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
      {letters.split("").map((char, index) => {
        const animationKey =
          `text${char.toUpperCase()}` as keyof typeof CUSTOM_LETTER;
        return (
          <LottieAnimation
            key={index}
            animationData={CUSTOM_LETTER[animationKey]}
            loop={true}
            width={50}
            height={50}
            autoplay={true}
          />
        );
      })}
    </div>
  );
}
