import type { PresetAnimalId } from "../domain/preset-animals";
import { PRESET_ANIMALS_BY_ID } from "../domain/preset-animals";

type PaintedMood = "idle" | "happy" | "eating";

interface PaintedAnimalProps {
  presetId: PresetAnimalId;
  mood?: PaintedMood;
  lookX?: number;
  lookY?: number;
  compact?: boolean;
}

export function PaintedAnimal({
  presetId,
  mood = "idle",
  compact = false,
}: PaintedAnimalProps) {
  const preset = PRESET_ANIMALS_BY_ID[presetId];
  const artUrl = `${import.meta.env.BASE_URL}stickers/${presetId}.png`;

  return (
    <div
      className={`painted-animal painted-animal--${presetId} painted-mood--${mood} ${
        compact ? "is-compact" : ""
      }`}
      data-art-style="reference-sticker-sheet"
      data-motion={preset.artMotion}
      data-mood={mood}
      data-preset-id={presetId}
    >
      <span className="painted-animal__halo" aria-hidden="true" />
      <img
        className="painted-animal__image"
        src={artUrl}
        alt={`${preset.species}${preset.name}的手账贴纸插画`}
        draggable={false}
      />
      <span className="painted-animal__spark" aria-hidden="true" />
    </div>
  );
}
