import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Heart, ImageOff, Sparkles } from "lucide-react";
import type { TouchEffect } from "../domain/preset-animals";
import type { Touchpoint } from "../domain/world";

interface AnimalArtworkStageProps {
  artworkUrl: string | null;
  touchpoints: Touchpoint[];
  editing: boolean;
  selectedTouchpointId: string | null;
  onAddTouchpoint?: (x: number, y: number) => void;
  onSelectTouchpoint?: (id: string) => void;
  onMoveTouchpoint?: (id: string, x: number, y: number) => void;
  onTouchpointTriggered?: (touchpoint: Touchpoint) => void;
}

interface ActiveEffect {
  id: number;
  touchpoint: Touchpoint;
}

const effectLabels: Record<TouchEffect, string> = {
  bounce: "弹跳",
  shake: "摇头",
  sparkle: "闪烁",
  hearts: "爱心",
  "short-clip": "短动画",
};

export function AnimalArtworkStage({
  artworkUrl,
  touchpoints,
  editing,
  selectedTouchpointId,
  onAddTouchpoint,
  onSelectTouchpoint,
  onMoveTouchpoint,
  onTouchpointTriggered,
}: AnimalArtworkStageProps) {
  const stage = useRef<HTMLDivElement>(null);
  const dragging = useRef<string | null>(null);
  const nextEffectId = useRef(0);
  const [effects, setEffects] = useState<ActiveEffect[]>([]);

  useEffect(
    () => () => {
      setEffects([]);
    },
    [],
  );

  function percentFromPointer(event: ReactPointerEvent) {
    const bounds = stage.current?.getBoundingClientRect();
    if (!bounds) return { x: 0.5, y: 0.5 };
    return {
      x: Math.min(0.96, Math.max(0.04, (event.clientX - bounds.left) / bounds.width)),
      y: Math.min(0.96, Math.max(0.04, (event.clientY - bounds.top) / bounds.height)),
    };
  }

  function trigger(touchpoint: Touchpoint) {
    if (editing) {
      onSelectTouchpoint?.(touchpoint.id);
      return;
    }
    const effect = { id: nextEffectId.current++, touchpoint };
    setEffects((current) => [...current.slice(-3), effect]);
    onTouchpointTriggered?.(touchpoint);
    window.setTimeout(() => {
      setEffects((current) => current.filter((item) => item.id !== effect.id));
    }, 900);
  }

  if (!artworkUrl) {
    return (
      <div className="artwork-missing" role="img" aria-label="原创画作缺失">
        <ImageOff size={30} aria-hidden="true" />
        <strong>画作暂时没有加载出来</strong>
        <span>动物记录仍在，可以重新上传一张图片。</span>
      </div>
    );
  }

  return (
    <div
      ref={stage}
      className={`artwork-stage ${editing ? "is-editing" : ""}`}
      onPointerDown={(event) => {
        if (editing && event.target === event.currentTarget) {
          const point = percentFromPointer(event);
          onAddTouchpoint?.(point.x, point.y);
        }
      }}
      onPointerMove={(event) => {
        if (editing && dragging.current) {
          const point = percentFromPointer(event);
          onMoveTouchpoint?.(dragging.current, point.x, point.y);
        }
      }}
      onPointerUp={() => {
        dragging.current = null;
      }}
      onPointerLeave={() => {
        dragging.current = null;
      }}
    >
      <img src={artworkUrl} alt="用户上传的原创动物画作" draggable={false} />
      <div className="artwork-glow" aria-hidden="true" />

      {touchpoints.map((touchpoint) => (
        <button
          key={touchpoint.id}
          type="button"
          className={`artwork-touchpoint ${
            selectedTouchpointId === touchpoint.id ? "is-selected" : ""
          }`}
          style={{ left: `${touchpoint.x * 100}%`, top: `${touchpoint.y * 100}%` }}
          aria-label={`${touchpoint.label || "触摸点"} ${effectLabels[touchpoint.effect]}`}
          onPointerDown={(event) => {
            if (!editing) return;
            event.stopPropagation();
            dragging.current = touchpoint.id;
            onSelectTouchpoint?.(touchpoint.id);
          }}
          onClick={(event) => {
            event.stopPropagation();
            trigger(touchpoint);
          }}
        >
          <span>{editing ? touchpoint.id.slice(-2) : ""}</span>
        </button>
      ))}

      {effects.map((effect) => (
        <span
          key={effect.id}
          className={`touch-effect touch-effect--${effect.touchpoint.effect}`}
          style={{
            left: `${effect.touchpoint.x * 100}%`,
            top: `${effect.touchpoint.y * 100}%`,
          }}
          aria-hidden="true"
        >
          {effect.touchpoint.effect === "hearts" && <Heart fill="currentColor" />}
          {effect.touchpoint.effect === "sparkle" && <Sparkles />}
        </span>
      ))}

      {effects.length > 0 &&
        ["bounce", "shake", "short-clip"].includes(
          effects[effects.length - 1].touchpoint.effect,
        ) && (
          <span
            key={`echo-${effects[effects.length - 1].id}`}
            className={`artwork-image-echo artwork-image-echo--${
              effects[effects.length - 1].touchpoint.effect
            }`}
            style={{
              clipPath: `circle(64px at ${
                effects[effects.length - 1].touchpoint.x * 100
              }% ${effects[effects.length - 1].touchpoint.y * 100}%)`,
              transformOrigin: `${
                effects[effects.length - 1].touchpoint.x * 100
              }% ${effects[effects.length - 1].touchpoint.y * 100}%`,
            }}
            aria-hidden="true"
          >
            <img src={artworkUrl} alt="" draggable={false} />
          </span>
        )}
    </div>
  );
}
