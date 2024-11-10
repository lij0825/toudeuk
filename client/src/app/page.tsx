"use client";

import { useRef, useEffect, useState } from "react";
import Login from "./components/Login";

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [targetParticles, setTargetParticles] = useState<Particle[]>([]);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const text = "터득";
    ctx.font = "bold 80px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const initialTargetParticles: Particle[] = [];

    for (let y = 0; y < canvas.height; y += 5) {
      for (let x = 0; x < canvas.width; x += 5) {
        const alpha = imageData.data[(y * canvas.width + x) * 4 + 3];
        if (alpha > 128) {
          initialTargetParticles.push({
            x: 0, // 초기 위치는 클릭 위치로 지정됨
            y: 0, // 초기 위치는 클릭 위치로 지정됨
            targetX: x,
            targetY: y,
            color: "black", // 색상을 검정으로 고정
          });
        }
      }
    }

    setTargetParticles(initialTargetParticles);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setClickCount((prevCount) => prevCount + 1);

    const particlesPerClick = 10;
    const nextParticles = targetParticles
      .slice(
        clickCount * particlesPerClick,
        (clickCount + 1) * particlesPerClick
      )
      .map((particle) => ({
        ...particle,
        x: clickX,
        y: clickY,
      }));

    setParticles((prevParticles) => [...prevParticles, ...nextParticles]);
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen bg-white p-8 overflow-hidden relative"
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        style={{ display: "none" }}
      ></canvas>
      {/* <div className="relative w-[400px] h-[200px] flex items-center justify-center">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              position: "absolute",
              width: "4px",
              height: "4px",
              backgroundColor: particle.color,
              transition: `transform 2s ease-out, opacity 1.5s ease-out`,
              transform: `translate(${particle.targetX - particle.x}px, ${
                particle.targetY - particle.y
              }px)`,
              opacity: 1,
            }}
          ></div>
        ))}
      </div> */}
      터득
      <Login />
      <style jsx>{`
        .particle {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
