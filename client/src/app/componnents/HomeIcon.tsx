"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

const Particles = () => {
  const particlesRef = useRef<THREE.Points>(null!);
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 1000;
  const positions = new Float32Array(count * 3); // Array for storing particle positions

  // Generate random positions for particles
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  // Animate particles (e.g., rotate them)
  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.rotation.x -= 0.001;
    }
  });

  const textureLoader = new THREE.TextureLoader();
  const particleTexture = textureLoader.load("/circle_05.png");

  // Create a points material for the particles
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: "#ffffff",
    map: particleTexture,
    sizeAttenuation: true,
    transparent: true, // 투명도 적용 여부
    alphaTest: 0.01,
    opacity: 1, // 투명도 값 (0은 완전 투명, 1은 불투명)
    blending: THREE.AdditiveBlending, // 밝게 겹쳐보이게 블렌딩 처리
    depthWrite: false, // 깊이 버퍼에 쓰지 않음 (겹쳐도 부드럽게 보임)
  });

  return (
    <points
      ref={particlesRef}
      geometry={particlesGeometry}
      material={particlesMaterial}
    />
  );
};

export default function HomeIcon() {
  return (
    <div className="w-full h-full z-0">
      <Canvas camera={{ position: [0, 2, 7] }}>
        <Suspense fallback={null}>
          <Particles />
          <ambientLight intensity={0} /> {/* 주변 광원: 기본 밝기 */}
          {/* 포인트 광원: 특정 위치에서 빛 방출 */}
          <pointLight position={[1, 2, 6]} intensity={2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
