import { lazy, Suspense, useState, type CSSProperties } from "react";
import type { PresetAnimalDefinition } from "../../domain/preset-animals";

const Animal3DCanvas = lazy(() =>
  import("./Animal3DCanvas").then((module) => ({
    default: module.Animal3DCanvas,
  })),
);

interface Animal3DStageProps {
  preset: PresetAnimalDefinition;
  interactive?: boolean;
  reducedQuality?: boolean;
  forceFallback?: boolean;
  variant?: "home" | "detail";
  onTouchRegion?: (region: string) => void;
}

export function supportsWebGL(): boolean {
  if (typeof document === "undefined") return false;
  if (import.meta.env.MODE === "test") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export function Animal3DStage({
  preset,
  interactive = true,
  reducedQuality = false,
  forceFallback = false,
  variant = "detail",
  onTouchRegion,
}: Animal3DStageProps) {
  const [webgl] = useState(() => supportsWebGL());

  if (forceFallback || !webgl) {
    return <AnimalStageFallback preset={preset} />;
  }

  return (
    <div
      className="animal-3d-stage"
      role="img"
      aria-label={`可旋转的${preset.species}${preset.name}3D舞台`}
    >
      <Suspense
        fallback={
          <AnimalStageFallback preset={preset} loading />
        }
      >
        <Animal3DCanvas
          preset={preset}
          interactive={interactive}
          reducedQuality={reducedQuality}
          variant={variant}
          onTouchRegion={onTouchRegion}
        />
      </Suspense>
      <div className="animal-3d-caption">
        <span className="animal-3d-caption__dot" aria-hidden="true" />
        <span>拖拽旋转 · 双指缩放</span>
      </div>
    </div>
  );
}

function AnimalStageFallback({
  preset,
  loading = false,
}: {
  preset: PresetAnimalDefinition;
  loading?: boolean;
}) {
  const style = {
    "--fallback-fur": preset.palette.primary,
    "--fallback-face": preset.palette.secondary,
    "--fallback-inner": preset.palette.inner,
    "--fallback-accent": preset.palette.accent,
    "--fallback-eye": preset.palette.eye,
  } as CSSProperties;
  return (
    <div
      className={`animal-3d-fallback animal-3d-fallback--${preset.id}`}
      style={style}
      role="img"
      aria-label={`${preset.species}${preset.name}静态形象`}
    >
      <div className="animal-3d-fallback__halo" aria-hidden="true" />
      <div className="animal-3d-fallback__face" aria-hidden="true">
        <span />
        <span />
        <i />
      </div>
      <div>
        <strong>{preset.name}</strong>
        <small>{loading ? "正在靠近" : preset.habitat}</small>
      </div>
    </div>
  );
}
