
import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Group = 'group' as any;
const Fog = 'fog' as any;
const AmbientLight = 'ambientLight' as any;

function NetworkNodes() {
  const ref = useRef<THREE.Points>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  const positions = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4.2 + Math.random() * 0.5;
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.y = time * 0.05;

    // Heartbeat pulse effect: double beat
    const pulse = Math.pow(Math.sin(time * 3), 10) * 0.15;
    const beat = Math.pow(Math.sin(time * 3 + 0.3), 10) * 0.1;
    groupRef.current.scale.setScalar(1 + pulse + beat);

    // Subtle breathing
    ref.current.rotation.x = Math.sin(time * 0.5) * 0.1;
  });

  return (
    <Group ref={groupRef} rotation={[0, 0, Math.PI / 12]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#f43f5e"
          size={0.07}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>
      {/* Central Core Pulse */}
      <mesh>
        <sphereGeometry args={[3.8, 32, 32]} />
        <meshBasicMaterial color="#f43f5e" transparent opacity={0.05} />
      </mesh>
    </Group>
  );
}

const Hero3D = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    if (!isMobile) window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="absolute inset-0 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e1b4b_0%,#020617_100%)] opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <svg className="w-full h-full opacity-[0.05]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.1" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.1" fill="none" />
            <path d="M10 50H90M50 10V90" stroke="white" strokeWidth="0.05" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 z-0 bg-slate-950 transition-transform duration-1000 ease-out"
      style={{
        transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`
      }}
    >
      <Suspense fallback={<div className="bg-slate-950 w-full h-full" />}>
        <Canvas camera={{ position: [0, 0, 10], fov: 40 }} gl={{ antialias: false, powerPreference: "high-performance" }}>
          <Fog attach="fog" args={['#020617', 5, 18]} />
          <NetworkNodes />
          <AmbientLight intensity={0.5} />
        </Canvas>
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950 pointer-events-none"></div>
    </div>
  );
};

export default Hero3D;
