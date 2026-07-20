"use client";

import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group, Mesh } from "three";

const BLADE_MATERIAL_PROPS = {
  color: "#c7d4dc",
  metalness: 1,
  roughness: 0.12,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
} as const;

const SCALE_MATERIAL_PROPS = {
  color: "#1c1a17",
  metalness: 0.3,
  roughness: 0.4,
} as const;

export function RazorModel({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const rootRef = useRef<Group>(null);
  const handleGroupRef = useRef<Group>(null);
  const tipRef = useRef<Mesh>(null);

  useFrame(() => {
    const progress = progressRef.current;
    if (rootRef.current) {
      rootRef.current.rotation.y = progress * Math.PI * 0.7 - 0.3;
    }
    if (handleGroupRef.current) {
      handleGroupRef.current.rotation.y = progress * -2.7;
    }
    if (tipRef.current) {
      tipRef.current.rotation.z = -0.4;
    }
  });

  return (
    <group ref={rootRef}>
      <group position={[-1.4, 0, 0]}>
        <RoundedBox args={[2.6, 0.26, 0.05]} radius={0.02} position={[1.3, 0, 0]}>
          <meshPhysicalMaterial {...BLADE_MATERIAL_PROPS} />
        </RoundedBox>
        <RoundedBox
          ref={tipRef}
          args={[0.5, 0.16, 0.05]}
          radius={0.02}
          position={[2.85, -0.05, 0]}
        >
          <meshPhysicalMaterial {...BLADE_MATERIAL_PROPS} />
        </RoundedBox>
        <group ref={handleGroupRef}>
          <RoundedBox
            args={[1.5, 0.46, 0.11]}
            radius={0.05}
            position={[-0.75, 0, 0.1]}
          >
            <meshPhysicalMaterial {...SCALE_MATERIAL_PROPS} />
          </RoundedBox>
          <RoundedBox
            args={[1.5, 0.46, 0.11]}
            radius={0.05}
            position={[-0.75, 0, -0.1]}
          >
            <meshPhysicalMaterial {...SCALE_MATERIAL_PROPS} />
          </RoundedBox>
        </group>
      </group>
    </group>
  );
}
