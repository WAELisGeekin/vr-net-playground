import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, RoundedBox, Line, Billboard, Text } from "@react-three/drei";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";

interface ComponentData {
  id: string;
  label: string;
  fullName: string;
  desc: string;
  position: [number, number, number];
  color: string;
}

const vrComponents: ComponentData[] = [
  { id: "hmd", label: "HMD", fullName: "Head-Mounted Display", desc: "Dual-lens stereoscopic display at 90-120Hz. Renders separate images for each eye to create depth perception. Resolution of 2K-4K per eye.", position: [0, 1.4, 0], color: "#a855f7" },
  { id: "sensors", label: "IMU", fullName: "Motion Sensors", desc: "Accelerometer, gyroscope & magnetometer. Tracks head orientation at 1000Hz for sub-millimeter accuracy.", position: [-1.8, 0, 0], color: "#06b6d4" },
  { id: "tracking", label: "6DoF", fullName: "Positional Tracking", desc: "Inside-out camera-based tracking using SLAM algorithms. 6 Degrees of Freedom for full movement.", position: [1.8, 0, 0], color: "#10b981" },
  { id: "render", label: "GPU", fullName: "Rendering Engine", desc: "GPU-intensive pipeline rendering stereo frames at 90fps. Uses foveated rendering & ASW to maintain framerate.", position: [0, -1.4, 0], color: "#f59e0b" },
];

function VRHeadsetModel({ onComponentClick, activeId }: { onComponentClick: (id: string) => void; activeId: string | null }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* VR Headset Body */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group>
          {/* Main body */}
          <RoundedBox args={[2, 1, 1.2]} radius={0.2} smoothness={4}>
            <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
          </RoundedBox>
          {/* Visor / Front lens area */}
          <RoundedBox args={[1.8, 0.7, 0.1]} radius={0.1} position={[0, 0, 0.6]}>
            <meshStandardMaterial color="#6d28d9" metalness={0.9} roughness={0.1} emissive="#6d28d9" emissiveIntensity={0.3} />
          </RoundedBox>
          {/* Left lens */}
          <mesh position={[-0.4, 0, 0.65]}>
            <circleGeometry args={[0.22, 32]} />
            <meshStandardMaterial color="#0f0f23" metalness={1} roughness={0} />
          </mesh>
          {/* Right lens */}
          <mesh position={[0.4, 0, 0.65]}>
            <circleGeometry args={[0.22, 32]} />
            <meshStandardMaterial color="#0f0f23" metalness={1} roughness={0} />
          </mesh>
          {/* Strap top */}
          <RoundedBox args={[0.3, 0.15, 2]} radius={0.07} position={[0, 0.55, -0.4]}>
            <meshStandardMaterial color="#2d2d44" roughness={0.6} />
          </RoundedBox>
          {/* Strap sides */}
          <RoundedBox args={[0.15, 0.3, 1.5]} radius={0.07} position={[1.05, 0, -0.3]}>
            <meshStandardMaterial color="#2d2d44" roughness={0.6} />
          </RoundedBox>
          <RoundedBox args={[0.15, 0.3, 1.5]} radius={0.07} position={[-1.05, 0, -0.3]}>
            <meshStandardMaterial color="#2d2d44" roughness={0.6} />
          </RoundedBox>
        </group>
      </Float>

      {/* Component nodes around the headset */}
      {vrComponents.map((comp) => (
        <ComponentNode
          key={comp.id}
          data={comp}
          isActive={activeId === comp.id}
          onClick={() => onComponentClick(comp.id)}
        />
      ))}

      {/* Connection lines */}
      {vrComponents.map((comp) => (
        <ConnectionLine key={`line-${comp.id}`} start={[0, 0, 0]} end={comp.position} color={comp.color} isActive={activeId === comp.id} />
      ))}
    </group>
  );
}

function ComponentNode({ data, isActive, onClick }: { data: ComponentData; isActive: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(isActive ? 1.3 : hovered ? 1.15 : 1);
    }
  });

  return (
    <group position={data.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={isActive ? 0.8 : hovered ? 0.4 : 0.15}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <Billboard position={[0, -0.55, 0]}>
        <Text fontSize={0.18} color="white" anchorX="center" anchorY="top">
          {data.label}
        </Text>
      </Billboard>
      {/* Glow ring */}
      {isActive && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.55, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function ConnectionLine({ start, end, color, isActive }: { start: [number, number, number]; end: [number, number, number]; color: string; isActive: boolean }) {
  return (
    <Line
      points={[start, end]}
      color={color}
      transparent
      opacity={isActive ? 0.8 : 0.2}
      lineWidth={isActive ? 2 : 1}
    />
  );
}

interface VRHeadset3DProps {
  onComponentSelect?: (component: ComponentData | null) => void;
}

const VRHeadset3D = ({ onComponentSelect }: VRHeadset3DProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleClick = (id: string) => {
    const newId = activeId === id ? null : id;
    setActiveId(newId);
    const comp = vrComponents.find(c => c.id === newId) || null;
    onComponentSelect?.(comp);
  };

  return (
    <div className="w-full h-[350px] md:h-[420px] rounded-xl overflow-hidden relative border border-border bg-background">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 1.5]} style={{ background: 'transparent' }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#a855f7" />
          <pointLight position={[-5, -3, 3]} intensity={0.5} color="#06b6d4" />
          <spotLight position={[0, 5, 0]} intensity={0.8} angle={0.5} penumbra={0.5} />
          <VRHeadsetModel onComponentClick={handleClick} activeId={activeId} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI * 3 / 4}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-3 left-3 text-[10px] font-mono text-muted-foreground bg-background/60 backdrop-blur-sm px-2 py-1 rounded">
        Drag to rotate • Click nodes to explore
      </div>
    </div>
  );
};

export { vrComponents };
export type { ComponentData };
export default VRHeadset3D;
