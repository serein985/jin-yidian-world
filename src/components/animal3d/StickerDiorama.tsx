import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, MathUtils, SRGBColorSpace } from "three";
import type { PresetAnimalDefinition } from "../../domain/preset-animals";

interface StickerDioramaProps {
  preset: PresetAnimalDefinition;
  interactive?: boolean;
  onTouchRegion?: (region: string) => void;
}

export function StickerDiorama({
  preset,
  interactive = true,
  onTouchRegion,
}: StickerDioramaProps) {
  const artUrl = `${import.meta.env.BASE_URL}stickers/${preset.id}.svg`;
  const texture = useTexture(artUrl);
  const root = useRef<Group>(null);
  const puppet = useRef<Group>(null);
  const farLayer = useRef<Group>(null);
  const nearLayer = useRef<Group>(null);
  const bounceTime = useRef(0);
  const pointer = useThree((state) => state.pointer);

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((state, delta) => {
    if (root.current) {
      root.current.position.y =
        0.08 + Math.sin(state.clock.elapsedTime * 1.35) * 0.035;
      root.current.rotation.y = MathUtils.damp(
        root.current.rotation.y,
        0.16 +
          Math.sin(state.clock.elapsedTime * 0.62) * 0.045 +
          (interactive ? pointer.x * 0.2 : 0),
        2.8,
        delta,
      );
      root.current.rotation.x = MathUtils.damp(
        root.current.rotation.x,
        interactive ? -pointer.y * 0.08 : 0,
        2.8,
        delta,
      );
    }

    if (puppet.current) {
      puppet.current.rotation.z = MathUtils.damp(
        puppet.current.rotation.z,
        interactive ? pointer.x * -0.045 : 0,
        3.2,
        delta,
      );
    }

    if (farLayer.current) {
      farLayer.current.position.x = MathUtils.damp(
        farLayer.current.position.x,
        interactive ? pointer.x * -0.12 : 0,
        2.4,
        delta,
      );
    }

    if (nearLayer.current) {
      nearLayer.current.position.x = MathUtils.damp(
        nearLayer.current.position.x,
        interactive ? pointer.x * 0.055 : 0,
        3.4,
        delta,
      );
    }

    if (bounceTime.current > 0) {
      bounceTime.current = Math.max(0, bounceTime.current - delta);
      if (puppet.current) {
        const progress = 1 - bounceTime.current / 0.5;
        puppet.current.position.y = Math.sin(progress * Math.PI) * 0.2;
        puppet.current.scale.setScalar(
          1 + Math.sin(progress * Math.PI * 2) * 0.018,
        );
      }
    } else if (puppet.current) {
      puppet.current.position.y = MathUtils.damp(
        puppet.current.position.y,
        0,
        8,
        delta,
      );
      puppet.current.scale.x = MathUtils.damp(
        puppet.current.scale.x,
        1,
        8,
        delta,
      );
      puppet.current.scale.y = puppet.current.scale.x;
      puppet.current.scale.z = puppet.current.scale.x;
    }
  });

  function handleTouch(region: string) {
    if (!interactive) return;
    bounceTime.current = 0.5;
    onTouchRegion?.(region);
  }

  return (
    <group ref={root}>
      <group ref={puppet}>
        <group ref={farLayer}>
          {[-0.42, -0.31, -0.2, -0.1].map((depth, index) => (
            <mesh
              key={depth}
              position={[0, 0.015, depth]}
              scale={1.04 - index * 0.007}
            >
              <planeGeometry args={[2.7, 2.7]} />
              <meshBasicMaterial
                map={texture}
                color={index % 2 ? "#b8957f" : "#d9bba5"}
                transparent
                alphaTest={0.025}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
        <group ref={nearLayer}>
          <mesh
            position={[0, 0, 0.02]}
            onPointerDown={(event) => {
              event.stopPropagation();
              handleTouch("body");
            }}
          >
            <planeGeometry args={[2.7, 2.7]} />
            <meshBasicMaterial
              map={texture}
              transparent
              alphaTest={0.025}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>

      <mesh position={[-1.08, 0.74, -0.38]} rotation={[0, 0, 0.24]}>
        <circleGeometry args={[0.13, 5]} />
        <meshBasicMaterial
          color={preset.palette.accent}
          transparent
          opacity={0.58}
        />
      </mesh>
      <mesh position={[1.02, 0.88, -0.42]} rotation={[0, 0, -0.15]}>
        <circleGeometry args={[0.09, 4]} />
        <meshBasicMaterial
          color={preset.palette.inner}
          transparent
          opacity={0.48}
        />
      </mesh>
    </group>
  );
}
