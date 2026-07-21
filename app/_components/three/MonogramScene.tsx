"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

const GOLD = "#d6b36a";
const GOLD_LIGHT = "#f1e2bd";

function buildMonogramGeometry() {
  const H = 2.4;
  const W = 1.9;
  const t = 0.42;
  const dh = 0.55;

  const bar = (x0: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(x0, 0);
    shape.lineTo(x0 + t, 0);
    shape.lineTo(x0 + t, H);
    shape.lineTo(x0, H);
    shape.closePath();
    return shape;
  };

  const diagonal = new THREE.Shape();
  diagonal.moveTo(t, H);
  diagonal.lineTo(t, H - dh);
  diagonal.lineTo(W - t, 0);
  diagonal.lineTo(W - t, dh);
  diagonal.closePath();

  const geometry = new THREE.ExtrudeGeometry([bar(0), diagonal, bar(W - t)], {
    depth: 0.35,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.045,
    bevelSegments: 5,
    curveSegments: 8,
  });
  geometry.center();
  return geometry;
}

function Monogram({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => buildMonogramGeometry(), []);

  useFrame((state) => {
    if (!group.current) return;
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = -0.4 + p * Math.PI * 2.4 + Math.sin(t * 0.25) * 0.05;
    group.current.rotation.x = 0.08 + Math.sin(t * 0.4) * 0.06;
    group.current.position.y = Math.sin(t * 0.6) * 0.08;
    group.current.scale.setScalar(0.9 + Math.sin(p * Math.PI) * 0.18);
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={GOLD}
          metalness={0.85}
          roughness={0.24}
          clearcoat={0.8}
          clearcoatRoughness={0.25}
          envMapIntensity={1.4}
        />
      </mesh>
    </group>
  );
}

function GoldDust() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    // Seeded LCG statt Math.random: deterministisch und damit stabil
    // über Re-Renders (react-hooks/purity).
    let seed = 1987;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const count = 260;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.2 + rand() * 2.8;
      const theta = rand() * Math.PI * 2;
      arr[i * 3] = Math.cos(theta) * radius;
      arr[i * 3 + 1] = (rand() - 0.5) * 3.4;
      arr[i * 3 + 2] = Math.sin(theta) * radius * 0.6 - 0.5;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={GOLD}
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function MonogramScene({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 35 }} dpr={[1, 2]}>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[4, 5, 6]}
        angle={0.4}
        penumbra={0.8}
        intensity={60}
        color={GOLD_LIGHT}
      />
      <directionalLight position={[0, 2, 6]} intensity={1.4} color={GOLD_LIGHT} />
      <pointLight position={[-4, -2, 3]} intensity={14} color={GOLD} />
      <Environment preset="studio" />
      <Monogram progressRef={progressRef} />
      <GoldDust />
    </Canvas>
  );
}
