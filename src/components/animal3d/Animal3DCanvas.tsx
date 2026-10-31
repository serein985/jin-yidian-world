import { ContactShadows, OrbitControls, Sparkles } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { PresetAnimalDefinition } from "../../domain/preset-animals";
import { getModelConfig } from "./model-configs";
import { PlushAnimal } from "./PlushAnimal";

interface Animal3DCanvasProps {
  preset: PresetAnimalDefinition;
  interactive: boolean;
  reducedQuality: boolean;
  variant: "home" | "detail";
  onTouchRegion?: (region: string) => void;
}

export function Animal3DCanvas({
  preset,
  interactive,
  reducedQuality,
  variant,
  onTouchRegion,
}: Animal3DCanvasProps) {
  const config = getModelConfig(preset.id);
  return (
    <Canvas
      camera={
        variant === "home"
          ? { position: [0, 1.3, 6.2], fov: 35 }
          : { position: [0, 1.35, 4.9], fov: 35 }
      }
      dpr={reducedQuality ? [1, 1.25] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#7f9a7d"]} />
        <fog attach="fog" args={["#789375", 5.5, 11]} />
        <ambientLight intensity={0.75} color="#edf1da" />
        <directionalLight
          position={[3.6, 5, 4.5]}
          intensity={2.3}
          color="#fff0cc"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight
          position={[-3.5, 3.6, 2.8]}
          angle={0.62}
          penumbra={1}
          intensity={1.4}
          color="#c9dbe2"
        />
        <pointLight position={[0, 1.8, 3]} intensity={0.5} color="#ffd1b2" />
        <group
          scale={variant === "home" ? 0.8 : 1}
          position={[0, variant === "home" ? -0.04 : 0, 0]}
        >
          <PlushAnimal
            config={config}
            interactive={interactive}
            onTouchRegion={onTouchRegion}
          />
        </group>
        <ContactShadows
          position={[0, -0.72, 0]}
          opacity={0.34}
          scale={5.2}
          blur={2.8}
          far={4}
          color="#233b2b"
        />
        {!reducedQuality && (
          <Sparkles
            count={20}
            scale={[5, 3.5, 2]}
            size={1.7}
            speed={0.2}
            color="#f5eac7"
            opacity={0.35}
          />
        )}
        <OrbitControls
          enabled={interactive}
          enablePan={false}
          enableZoom={interactive}
          minDistance={3.4}
          maxDistance={6.2}
          minPolarAngle={Math.PI * 0.33}
          maxPolarAngle={Math.PI * 0.57}
          autoRotate={interactive && !reducedQuality}
          autoRotateSpeed={0.32}
          target={[0, variant === "home" ? 0.96 : 1.04, 0]}
        />
      </Suspense>
    </Canvas>
  );
}
