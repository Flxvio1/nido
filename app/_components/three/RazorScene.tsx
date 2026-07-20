"use client";

import type { MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { RazorModel } from "./RazorModel";

export function RazorScene({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  return (
    <Canvas camera={{ position: [0, 0.6, 4.2], fov: 35 }} dpr={[1, 2]}>
      <ambientLight intensity={0.4} />
      <spotLight position={[3, 4, 5]} angle={0.3} penumbra={0.6} intensity={2.2} />
      <Environment preset="studio" />
      <RazorModel progressRef={progressRef} />
    </Canvas>
  );
}
