import { Heart, Sparkles, Tornado, WandSparkles, Zap } from "lucide-react";
import type { TouchEffect } from "../domain/preset-animals";

interface TouchEffectPickerProps {
  value: TouchEffect;
  onChange: (effect: TouchEffect) => void;
}

const effects: Array<{
  id: TouchEffect;
  label: string;
  icon: typeof Heart;
}> = [
  { id: "bounce", label: "局部弹跳", icon: Zap },
  { id: "shake", label: "摇头", icon: Tornado },
  { id: "sparkle", label: "闪烁", icon: Sparkles },
  { id: "hearts", label: "冒爱心", icon: Heart },
  { id: "short-clip", label: "短动画", icon: WandSparkles },
];

export function TouchEffectPicker({ value, onChange }: TouchEffectPickerProps) {
  return (
    <div className="effect-picker" role="group" aria-label="触摸动画效果">
      {effects.map((effect) => {
        const Icon = effect.icon;
        return (
          <button
            key={effect.id}
            type="button"
            className={value === effect.id ? "is-active" : ""}
            aria-label={effect.label}
            aria-pressed={value === effect.id}
            onClick={() => onChange(effect.id)}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{effect.label}</span>
          </button>
        );
      })}
    </div>
  );
}
