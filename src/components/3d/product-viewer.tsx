"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function TechCore(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        {...props}
        ref={meshRef}
        scale={active ? 1.2 : 1}
        onClick={() => setActive(!active)}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshStandardMaterial 
          color={hovered ? '#3b82f6' : '#8b5cf6'} 
          wireframe={!hovered}
          emissive={hovered ? '#3b82f6' : '#8b5cf6'}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Inner Core */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.5]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={1}
          roughness={0}
        />
      </mesh>
    </Float>
  );
}

export default function ProductViewer3D() {
  return (
    <div className="w-full h-[400px] lg:h-[500px] bg-muted/10 rounded-3xl border border-border/50 relative overflow-hidden group cursor-grab active:cursor-grabbing shadow-inner">
      <div className="absolute top-6 left-6 z-10">
        <span className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase border border-border shadow-sm flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          Vista 3D Interactiva
        </span>
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 text-center z-10 opacity-50 pointer-events-none font-medium text-sm">
        Haz clic y arrastra para rotar el componente
      </div>
      
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <TechCore position={[0, 0, 0]} />
        
        <Environment preset="city" />
        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={4} 
          maxDistance={12}
          autoRotate 
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
