"use client";

import { Sky } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { OrbitControls, Clone } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Models = [{ name: "kim", url: "/models/uranus-10810858.glb" }];
interface ModelProps {
  url: string;
}

const Model = ({ url }: ModelProps) => {
  const { scene } = useGLTF(url);
  return <Clone object={scene} />;
};

const Box2 = (props: JSX.IntrinsicElements["mesh"]) => {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    //mesh.current.rotation.x = mesh.current.rotation.y += 0.05
  });
  return (
    <mesh {...props} ref={mesh}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshLambertMaterial attach="material" color="royalblue" />
    </mesh>
  );
};

export default function HomeIcon() {
  return (
    <div className="">
      <Canvas camera={{ position: [0, 0, -0.2], near: 0.025 }}>
        <Suspense>
          <Model url={Models[0].url} />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} />
          <Box2 position={[-1.2, 0, 0]} />
          <Box2 position={[1.2, 0, 0]} />
        </Suspense>
        <OrbitControls />
        <Sky sunPosition={[100, 110, 50]} />
      </Canvas>
    </div>
  );
}
