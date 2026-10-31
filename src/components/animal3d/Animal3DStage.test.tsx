import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRESET_ANIMALS_BY_ID } from "../../domain/preset-animals";
import { Animal3DStage } from "./Animal3DStage";

describe("Animal3DStage", () => {
  it("renders a complete static fallback when WebGL is unavailable", () => {
    render(
      <Animal3DStage
        preset={PRESET_ANIMALS_BY_ID["red-panda"]}
        forceFallback
      />,
    );

    expect(
      screen.getByRole("img", { name: "小橘猫栗栗静态形象" }),
    ).toBeInTheDocument();
    expect(screen.getByText("栗栗")).toBeInTheDocument();
    expect(
      document.querySelector('.animal-3d-fallback img[src$="/stickers/red-panda.svg"]'),
    ).not.toBeNull();
  });
});
