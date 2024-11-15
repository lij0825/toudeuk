import { memo } from "react";

interface SnowFlakesProps {
  className?: string;
}

const SnowFlakes: React.FC<SnowFlakesProps> = memo(({ className }) => {
  const snowflakeCount = 150;

  return (
    <div className={`snowflake-container ${className}`}>
      {Array.from({ length: snowflakeCount }).map((_, index) => {
        const size = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.7 + 0.3;

        return (
          <div
            key={index}
            className="snowflake absolute bg-white rounded-full"
            style={{
              width: `${size * 4}px`,
              height: `${size * 4}px`,
              opacity: opacity,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * -30}s`,
              left: `${Math.random() * 100}vw`,
            }}
          ></div>
        );
      })}
    </div>
  );
});

SnowFlakes.displayName = "SnowFlakes";

export default SnowFlakes;
