import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import {
  CanvasTexture,
  Group,
  MathUtils,
  RepeatWrapping,
} from "three";
import type { ModelConfig } from "./model-configs";

interface PlushAnimalProps {
  config: ModelConfig;
  interactive?: boolean;
  onTouchRegion?: (region: string) => void;
}

let furTexture: CanvasTexture | null = null;

function getFurTexture() {
  if (typeof document === "undefined") return null;
  if (furTexture) return furTexture;
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const image = context.createImageData(canvas.width, canvas.height);
  for (let index = 0; index < image.data.length; index += 4) {
    const value = 105 + Math.floor(Math.random() * 95);
    image.data[index] = value;
    image.data[index + 1] = value;
    image.data[index + 2] = value;
    image.data[index + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  furTexture = new CanvasTexture(canvas);
  furTexture.wrapS = RepeatWrapping;
  furTexture.wrapT = RepeatWrapping;
  furTexture.repeat.set(8, 8);
  return furTexture;
}

function PlushMaterial({
  color,
  roughness = 0.86,
}: {
  color: string;
  roughness?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      metalness={0}
      clearcoat={0.08}
      clearcoatRoughness={0.78}
      sheen={0.9}
      sheenColor={color}
      sheenRoughness={0.9}
      bumpMap={getFurTexture()}
      bumpScale={0.018}
    />
  );
}

function Eye({
  x,
  y,
  z,
  eyeColor,
  scale = 1,
}: {
  x: number;
  y: number;
  z: number;
  eyeColor: string;
  scale?: number;
}) {
  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh scale={[0.195, 0.26, 0.09]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshPhysicalMaterial
          color="#fffdf5"
          roughness={0.32}
          clearcoat={0.55}
          clearcoatRoughness={0.18}
        />
      </mesh>
      <mesh position={[0, 0.002, 0.095]} scale={[0.13, 0.19, 0.06]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshPhysicalMaterial
          color={eyeColor}
          roughness={0.16}
          clearcoat={0.75}
          clearcoatRoughness={0.08}
        />
      </mesh>
      <mesh position={[-0.033, 0.06, 0.137]} scale={[0.034, 0.047, 0.018]}>
        <sphereGeometry args={[1, 20, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.038, -0.052, 0.135]} scale={[0.017, 0.023, 0.012]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial color="#ffffff" opacity={0.72} transparent />
      </mesh>
      {[
        [-0.105, 0.19, 0.12, 0.34],
        [-0.145, 0.148, 0.12, 0.58],
        [-0.158, 0.1, 0.12, 0.78],
      ].map(([x, y, z, rotation]) => (
        <mesh
          key={`${x}-${y}`}
          position={[x, y, z]}
          rotation={[0, 0, rotation]}
          scale={[0.06, 0.008, 0.008]}
        >
          <capsuleGeometry args={[0.5, 1, 5, 10]} />
          <meshBasicMaterial color="#302622" />
        </mesh>
      ))}
    </group>
  );
}

function Ear({
  style,
  side,
  config,
}: {
  style: ModelConfig["earStyle"];
  side: -1 | 1;
  config: ModelConfig;
}) {
  const x = side * (style === "long" ? 0.3 : 0.56);
  const y = style === "long" ? 0.58 : 0.43;
  const rotationZ = side * (style === "floppy" ? 0.9 : style === "long" ? 0.16 : 0.25);

  if (style === "pointed") {
    return (
      <group position={[x, y, 0]} rotation={[0, 0, rotationZ]}>
        <mesh scale={[0.28, 0.45, 0.2]}>
          <tetrahedronGeometry args={[1, 2]} />
          <PlushMaterial color={config.primary} />
        </mesh>
        <mesh position={[0, -0.01, 0.1]} scale={[0.13, 0.24, 0.08]}>
          <tetrahedronGeometry args={[1, 1]} />
          <PlushMaterial color={config.inner} />
        </mesh>
      </group>
    );
  }

  if (style === "long") {
    return (
      <group position={[x, y + 0.15, 0]} rotation={[0.02, 0, rotationZ]}>
        <mesh scale={[0.22, 0.68, 0.2]}>
          <capsuleGeometry args={[0.65, 1.2, 12, 24]} />
          <PlushMaterial color={config.primary} />
        </mesh>
        <mesh position={[0, 0, 0.15]} scale={[0.1, 0.46, 0.06]}>
          <capsuleGeometry args={[0.7, 1, 10, 18]} />
          <PlushMaterial color={config.inner} />
        </mesh>
      </group>
    );
  }

  if (style === "floppy") {
    return (
      <group position={[x, y - 0.05, 0]} rotation={[0, 0, rotationZ]}>
        <mesh scale={[0.42, 0.2, 0.17]}>
          <sphereGeometry args={[1, 28, 20]} />
          <PlushMaterial color={config.secondary} />
        </mesh>
        <mesh position={[0, 0, 0.13]} scale={[0.24, 0.09, 0.04]}>
          <sphereGeometry args={[1, 20, 14]} />
          <PlushMaterial color={config.inner} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[x, y, 0]}>
      <mesh scale={style === "small" ? [0.2, 0.2, 0.15] : [0.34, 0.34, 0.22]}>
        <sphereGeometry args={[1, 32, 24]} />
        <PlushMaterial
          color={config.presetId === "panda" ? config.secondary : config.primary}
        />
      </mesh>
      <mesh position={[0, 0, 0.16]} scale={style === "small" ? [0.09, 0.09, 0.03] : [0.15, 0.15, 0.04]}>
        <sphereGeometry args={[1, 24, 18]} />
        <PlushMaterial color={config.inner} />
      </mesh>
    </group>
  );
}

function Tail({ config }: { config: ModelConfig }) {
  if (config.tailStyle === "ringed") {
    return (
      <group position={[1.1, 0.45, -0.45]} rotation={[0.2, 0, -0.35]}>
        {[-0.05, 0.27, 0.58, 0.86, 1.1].map((offset, index) => (
          <mesh
            key={offset}
            position={[offset, Math.sin(offset * 2.4) * 0.28, 0]}
            rotation={[0, 0, -0.25 - offset * 0.28]}
            scale={[0.32 - index * 0.025, 0.25, 0.22]}
          >
            <sphereGeometry args={[1, 32, 24]} />
            <PlushMaterial color={index % 2 ? "#6d4434" : config.primary} />
          </mesh>
        ))}
      </group>
    );
  }

  if (config.tailStyle === "fox") {
    return (
      <group position={[1.05, 0.58, -0.42]} rotation={[0.1, 0, -0.5]}>
        <mesh scale={[0.62, 0.36, 0.35]}>
          <sphereGeometry args={[1, 32, 24]} />
          <PlushMaterial color={config.primary} />
        </mesh>
        <mesh position={[0.45, 0.12, 0]} scale={[0.3, 0.27, 0.25]}>
          <sphereGeometry args={[1, 28, 20]} />
          <PlushMaterial color={config.secondary} />
        </mesh>
      </group>
    );
  }

  if (config.tailStyle === "fluffy") {
    return (
      <mesh position={[0.82, 0.6, -0.45]} scale={[0.3, 0.3, 0.3]}>
        <sphereGeometry args={[1, 24, 18]} />
        <PlushMaterial color={config.primary} />
      </mesh>
    );
  }

  if (config.tailStyle === "tiger") {
    return (
      <group position={[1.03, 0.58, -0.35]} rotation={[0, 0, -0.5]}>
        <mesh scale={[0.48, 0.18, 0.2]}>
          <capsuleGeometry args={[0.6, 1.5, 10, 20]} />
          <PlushMaterial color={config.primary} />
        </mesh>
        {[-0.32, 0, 0.3].map((y) => (
          <mesh key={y} position={[0, y, 0.19]} scale={[0.2, 0.07, 0.03]}>
            <boxGeometry />
            <PlushMaterial color={config.secondary} />
          </mesh>
        ))}
      </group>
    );
  }

  if (config.tailStyle === "penguin") {
    return (
      <mesh position={[0.7, 0.36, -0.35]} rotation={[0.2, 0, -0.5]} scale={[0.2, 0.45, 0.13]}>
        <capsuleGeometry args={[0.5, 1, 10, 16]} />
        <PlushMaterial color={config.primary} />
      </mesh>
    );
  }

  return (
    <mesh position={[0.78, 0.45, -0.42]} scale={[0.26, 0.24, 0.2]}>
      <sphereGeometry args={[1, 24, 18]} />
      <PlushMaterial color={config.secondary} />
    </mesh>
  );
}

function TigerStripes({ config }: { config: ModelConfig }) {
  return (
    <group>
      {[-0.3, -0.1, 0.12, 0.32].map((x, index) => (
        <mesh
          key={x}
          position={[x, 1.42 + Math.abs(x) * 0.12, 0.73]}
          rotation={[0.12, 0, index % 2 ? -0.18 : 0.18]}
          scale={[0.075, index % 2 ? 0.17 : 0.24, 0.035]}
        >
          <boxGeometry />
          <PlushMaterial color={config.secondary} />
        </mesh>
      ))}
      {[-0.62, 0.62].map((x, index) => (
        <mesh
          key={x}
          position={[x, 0.62, 0.7]}
          rotation={[0, 0, index ? 0.25 : -0.25]}
          scale={[0.08, 0.3, 0.04]}
        >
          <boxGeometry />
          <PlushMaterial color={config.secondary} />
        </mesh>
      ))}
    </group>
  );
}

export function PlushAnimal({
  config,
  interactive = true,
  onTouchRegion,
}: PlushAnimalProps) {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const pointer = useThree((state) => state.pointer);
  const bounceTime = useRef(0);

  useFrame((_, delta) => {
    if (root.current) {
      root.current.position.y = Math.sin(performance.now() * 0.0016) * 0.025;
      root.current.rotation.y = MathUtils.damp(
        root.current.rotation.y,
        interactive ? pointer.x * 0.12 : 0,
        2.5,
        delta,
      );
    }
    if (head.current) {
      head.current.rotation.y = MathUtils.damp(
        head.current.rotation.y,
        pointer.x * 0.16,
        3,
        delta,
      );
      head.current.rotation.x = MathUtils.damp(
        head.current.rotation.x,
        -pointer.y * 0.06,
        3,
        delta,
      );
    }
    if (bounceTime.current > 0) {
      bounceTime.current = Math.max(0, bounceTime.current - delta);
      if (root.current) {
        const progress = 1 - bounceTime.current / 0.42;
        root.current.position.y += Math.sin(progress * Math.PI) * 0.12;
      }
    }
  });

  function trigger(region: string) {
    if (!interactive) return;
    bounceTime.current = 0.42;
    onTouchRegion?.(region);
  }

  const isSheep = config.presetId === "sheep";
  const isPenguin = config.presetId === "penguin";

  return (
    <group ref={root} position={[0, 0.1, 0]}>
      <Tail config={config} />
      <group
        onPointerDown={(event) => {
          event.stopPropagation();
          trigger("body");
        }}
      >
        {isSheep ? (
          <group>
            {[
              [-0.55, 0.68, 0, 0.62],
              [0, 0.72, 0.04, 0.72],
              [0.55, 0.66, 0, 0.6],
              [-0.42, 0.25, 0.05, 0.5],
              [0.42, 0.25, 0.05, 0.5],
              [0, 0.3, 0.12, 0.58],
            ].map(([x, y, z, scale]) => (
              <mesh key={`${x}-${y}`} position={[x, y, z]} scale={[scale, scale * 0.92, scale]}>
                <sphereGeometry args={[1, 36, 26]} />
                <PlushMaterial color={config.primary} roughness={0.95} />
              </mesh>
            ))}
          </group>
        ) : (
          <mesh scale={config.bodyScale}>
            <sphereGeometry args={[0.84, 48, 36]} />
            <PlushMaterial color={isPenguin ? config.primary : config.primary} />
          </mesh>
        )}
        {isPenguin && (
          <mesh position={[0, 0.62, 0.53]} scale={[0.55, 0.8, 0.22]}>
            <sphereGeometry args={[1, 36, 28]} />
            <PlushMaterial color={config.secondary} />
          </mesh>
        )}
        <mesh position={[-0.58, 0.28, 0.53]} rotation={[0.1, 0, 0.35]} scale={[0.28, 0.5, 0.26]}>
          <capsuleGeometry args={[0.5, 1, 12, 20]} />
          <PlushMaterial color={config.presetId === "panda" ? config.secondary : config.primary} />
        </mesh>
        <mesh position={[0.58, 0.28, 0.53]} rotation={[0.1, 0, -0.35]} scale={[0.28, 0.5, 0.26]}>
          <capsuleGeometry args={[0.5, 1, 12, 20]} />
          <PlushMaterial color={config.presetId === "panda" ? config.secondary : config.primary} />
        </mesh>
        <mesh position={[-0.45, -0.55, 0.38]} scale={[0.32, 0.22, 0.38]}>
          <sphereGeometry args={[1, 28, 20]} />
          <PlushMaterial color={config.presetId === "panda" ? config.secondary : config.primary} />
        </mesh>
        <mesh position={[0.45, -0.55, 0.38]} scale={[0.32, 0.22, 0.38]}>
          <sphereGeometry args={[1, 28, 20]} />
          <PlushMaterial color={config.presetId === "panda" ? config.secondary : config.primary} />
        </mesh>
      </group>

      <group
        ref={head}
        position={[0, 1.43, 0.04]}
        onPointerDown={(event) => {
          event.stopPropagation();
          trigger("head");
        }}
      >
        <mesh scale={config.headScale}>
          <sphereGeometry args={[0.78, 56, 42]} />
          <PlushMaterial
            color={isPenguin ? config.secondary : config.primary}
            roughness={0.88}
          />
        </mesh>
        <Ear style={config.earStyle} side={-1} config={config} />
        <Ear style={config.earStyle} side={1} config={config} />

        {config.pattern === "panda" && (
          <group>
            <mesh position={[-0.28, 0.05, 0.7]} rotation={[0, 0, 0.5]} scale={[0.26, 0.34, 0.08]}>
              <sphereGeometry args={[1, 28, 20]} />
              <PlushMaterial color={config.secondary} />
            </mesh>
            <mesh position={[0.28, 0.05, 0.7]} rotation={[0, 0, -0.5]} scale={[0.26, 0.34, 0.08]}>
              <sphereGeometry args={[1, 28, 20]} />
              <PlushMaterial color={config.secondary} />
            </mesh>
          </group>
        )}
        {config.pattern === "mask" && (
          <mesh position={[0, 0.02, 0.69]} scale={[0.5, 0.42, 0.1]}>
            <sphereGeometry args={[1, 32, 24]} />
            <PlushMaterial color={config.secondary} />
          </mesh>
        )}

        <Eye x={-0.255} y={0.08} z={0.75} eyeColor={config.eye} />
        <Eye x={0.255} y={0.08} z={0.75} eyeColor={config.eye} />

        <mesh position={[0, -0.23, 0.72]} scale={config.snoutScale}>
          <sphereGeometry args={[1, 36, 26]} />
          <PlushMaterial color={isPenguin ? "#f3b15f" : config.secondary} />
        </mesh>
        <mesh position={[0, -0.18, 0.93]} scale={[0.09, 0.065, 0.075]}>
          <sphereGeometry args={[1, 24, 18]} />
          <meshPhysicalMaterial color="#3b2d2a" roughness={0.35} clearcoat={0.55} />
        </mesh>
        <group position={[0, -0.27, 0.92]}>
          <mesh position={[-0.055, -0.015, 0]} rotation={[0, 0, -0.55]} scale={[0.085, 0.012, 0.012]}>
            <capsuleGeometry args={[0.5, 1, 6, 12]} />
            <meshBasicMaterial color="#725249" />
          </mesh>
          <mesh position={[0.055, -0.015, 0]} rotation={[0, 0, 0.55]} scale={[0.085, 0.012, 0.012]}>
            <capsuleGeometry args={[0.5, 1, 6, 12]} />
            <meshBasicMaterial color="#725249" />
          </mesh>
        </group>
        <mesh position={[-0.42, -0.12, 0.72]} scale={[0.17, 0.075, 0.035]}>
          <sphereGeometry args={[1, 20, 12]} />
          <meshBasicMaterial color={config.accent} transparent opacity={0.45} />
        </mesh>
        <mesh position={[0.42, -0.12, 0.72]} scale={[0.17, 0.075, 0.035]}>
          <sphereGeometry args={[1, 20, 12]} />
          <meshBasicMaterial color={config.accent} transparent opacity={0.45} />
        </mesh>

        {config.pattern === "tiger" && <TigerStripes config={config} />}
        {isPenguin && (
          <mesh position={[0, -0.2, 0.95]} rotation={[Math.PI / 2, 0, 0]} scale={[0.24, 0.5, 0.18]}>
            <coneGeometry args={[1, 1.6, 28]} />
            <meshPhysicalMaterial color="#e89a4f" roughness={0.45} clearcoat={0.3} />
          </mesh>
        )}
      </group>

      <pointLight position={[0, 2.6, 2]} color="#ffe7c1" intensity={0.65} distance={5} />
    </group>
  );
}
