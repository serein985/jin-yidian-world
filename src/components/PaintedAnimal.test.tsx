import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRESET_ANIMALS } from "../domain/preset-animals";
import { PaintedAnimal } from "./PaintedAnimal";

describe("PaintedAnimal", () => {
  it("uses animated artwork from the reference sticker sheet for every preset", () => {
    for (const animal of PRESET_ANIMALS) {
      const { container, unmount } = render(
        <PaintedAnimal presetId={animal.id} />,
      );
      const illustration = container.querySelector(".painted-animal");
      const image = illustration?.querySelector<HTMLImageElement>(
        "img.painted-animal__image",
      );

      expect(illustration).toHaveAttribute(
        "data-art-style",
        "reference-sticker-sheet",
      );
      expect(illustration).toHaveAttribute("data-motion");
      expect(image).not.toBeNull();
      expect(image?.src).toContain(`/stickers/${animal.id}.png`);
      expect(image?.alt).toContain(animal.name);

      unmount();
    }
  });
});
