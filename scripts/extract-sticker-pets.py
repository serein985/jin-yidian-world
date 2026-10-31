from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter


PET_CROPS = {
    "rabbit": (0, 0, 108, 119),
    "bear-pie": (108, 0, 216, 121),
    "penguin": (216, 0, 324, 122),
    "sheep": (0, 116, 108, 233),
    "red-panda": (108, 114, 216, 234),
    "mirror-rabbit": (216, 116, 324, 234),
    "pig": (0, 230, 108, 351),
    "capybara": (108, 229, 216, 351),
    "fox": (216, 230, 324, 351),
    "book-dog": (0, 346, 108, 466),
    "panda": (108, 346, 216, 466),
    "tiger": (216, 346, 324, 466),
}


def extract_subject(image: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    crop = image.crop(box).convert("RGB")
    pixels = np.asarray(crop)
    hsv = cv2.cvtColor(pixels, cv2.COLOR_RGB2HSV)

    # White paper stays outside the character outlines. Selecting light,
    # low-saturation border components removes the paper without punching
    # holes through white faces or clothing.
    background_candidate = (
        (hsv[:, :, 2] >= 205) & (hsv[:, :, 1] <= 42)
    ).astype(np.uint8)
    count, labels = cv2.connectedComponents(background_candidate, connectivity=4)
    border_labels = set(labels[0, :]) | set(labels[-1, :])
    border_labels |= set(labels[:, 0]) | set(labels[:, -1])
    background = np.isin(labels, [label for label in border_labels if label])

    alpha = np.where(background, 0, 255).astype(np.uint8)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(
        (alpha > 0).astype(np.uint8), connectivity=8
    )
    if count <= 1:
        raise ValueError("No foreground components were found in the crop.")

    largest_area = max(stats[label, cv2.CC_STAT_AREA] for label in range(1, count))
    crop_height = alpha.shape[0]
    for label in range(1, count):
        top = stats[label, cv2.CC_STAT_TOP]
        height = stats[label, cv2.CC_STAT_HEIGHT]
        area = stats[label, cv2.CC_STAT_AREA]
        near_horizontal_edge = top <= 2 or top + height >= crop_height - 2
        small_edge_fragment = area < largest_area * 0.2
        if near_horizontal_edge and small_edge_fragment:
            alpha[labels == label] = 0

    alpha = cv2.GaussianBlur(alpha, (3, 3), 0.45)
    rgba = np.dstack((pixels, alpha))
    result = Image.fromarray(rgba, "RGBA")

    alpha_channel = result.getchannel("A")
    bounds = alpha_channel.point(lambda value: 255 if value > 16 else 0).getbbox()
    if bounds is None:
        raise ValueError("No character pixels were found in the crop.")

    subject = result.crop(bounds)
    side = max(subject.width, subject.height)
    padding = max(18, round(side * 0.1))
    canvas_side = side + padding * 2
    canvas = Image.new("RGBA", (canvas_side, canvas_side), (0, 0, 0, 0))
    canvas.alpha_composite(
        subject,
        ((canvas_side - subject.width) // 2, (canvas_side - subject.height) // 2),
    )
    resized = canvas.resize((512, 512), Image.Resampling.LANCZOS)
    return resized.filter(
        ImageFilter.UnsharpMask(radius=1.1, percent=125, threshold=2)
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    source = Image.open(args.source).convert("RGB")
    args.output.mkdir(parents=True, exist_ok=True)

    for name, box in PET_CROPS.items():
        subject = extract_subject(source, box)
        subject.save(args.output / f"{name}.png", optimize=True)

    print(f"Wrote {len(PET_CROPS)} sticker assets to {args.output}")


if __name__ == "__main__":
    main()
