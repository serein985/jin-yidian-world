import {
  PRESET_ANIMALS_BY_ID,
  type PresetAnimalId,
} from "../../domain/preset-animals";

export interface ModelConfig {
  presetId: PresetAnimalId;
  primary: string;
  secondary: string;
  accent: string;
  inner: string;
  eye: string;
  bodyScale: [number, number, number];
  headScale: [number, number, number];
  snoutScale: [number, number, number];
  earStyle: "round" | "pointed" | "long" | "small" | "floppy";
  tailStyle: "short" | "ringed" | "tiger" | "fluffy" | "fox" | "penguin";
  pattern: "none" | "panda" | "tiger" | "mask";
}

export function getModelConfig(presetId: PresetAnimalId): ModelConfig {
  const preset = PRESET_ANIMALS_BY_ID[presetId];
  return {
    presetId,
    primary: preset.palette.primary,
    secondary: preset.palette.secondary,
    accent: preset.palette.accent,
    inner: preset.palette.inner,
    eye: preset.palette.eye,
    ...preset.model,
  };
}
