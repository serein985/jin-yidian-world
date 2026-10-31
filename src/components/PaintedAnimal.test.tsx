import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRESET_ANIMALS } from "../domain/preset-animals";
import { PaintedAnimal } from "./PaintedAnimal";

describe("PaintedAnimal", () => {
  it("renders every preset with its own hand-drawn sticker accessory", () => {
    for (const animal of PRESET_ANIMALS) {
      const { container, unmount } = render(
        <PaintedAnimal presetId={animal.id} />,
      );
      const illustration = container.querySelector(".painted-animal");

      expect(illustration).toHaveAttribute(
        "data-art-style",
        "hand-drawn-sticker",
      );
      expect(
        illustration?.querySelector(
          `[data-sticker-accessory="${animal.id}"]`,
        ),
      ).not.toBeNull();

      unmount();
    }
  });

  it("gives every preset a distinct lively sticker expression", () => {
    const expectedExpressions = {
      panda: "content",
      "red-panda": "wink",
      tiger: "squint",
      sheep: "shy",
      capybara: "sleepy",
      rabbit: "bright",
      fox: "sly",
      penguin: "excited",
    } as const;

    for (const animal of PRESET_ANIMALS) {
      const { container, unmount } = render(
        <PaintedAnimal presetId={animal.id} />,
      );
      const illustration = container.querySelector(".painted-animal");

      expect(illustration).toHaveAttribute(
        "data-expression",
        expectedExpressions[animal.id],
      );
      expect(illustration?.querySelector(".painted-brows")).not.toBeNull();
      expect(
        illustration?.querySelectorAll('[data-eye="left"], [data-eye="right"]'),
      ).toHaveLength(2);

      unmount();
    }
  });
});
