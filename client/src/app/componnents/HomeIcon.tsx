"use client";

import { Clone, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

const Models = [{ url: "/models/uranus-10810858.glb" }];
interface ModelProps {
  url: string;
}

const Model = ({ url }: ModelProps) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null!);

  // Rotate the model automatically
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001;
      modelRef.current.rotation.x += 0.001;
    }
  });

  return <Clone ref={modelRef} object={scene} />;
};

export default function HomeIcon() {
  return (
    <div className="w-full h-full z-0">
      <Canvas camera={{ position: [0, 2, 6] }}>
        <Suspense fallback={null}>
          <Model url={Models[0].url} />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
