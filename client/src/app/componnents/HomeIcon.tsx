"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import * as THREE from "three";

const Particles = () => {
  const particlesRef = useRef<THREE.Points>(null!);

  const particlesGeometry = new THREE.BufferGeometry();
  const count = 500;
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
    }
  });

  // Create a points material for the particles
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: "#ffffff",
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
  useEffect(() => {
    // Optional: Log or handle Sentry issues here
    // Add necessary Sentry logging/error handling if needed
  }, []);

  return (
    <div className="w-full h-full z-0">
      <Canvas camera={{ position: [0, 2, 6] }}>
        <Suspense fallback={null}>
          <Particles />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
