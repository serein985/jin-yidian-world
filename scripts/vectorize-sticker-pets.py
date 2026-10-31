from __future__ import annotations

import argparse
from pathlib import Path

import vtracer
from PIL import Image, ImageEnhance


def vectorize(source: Path, output: Path) -> None:
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A").point(lambda value: 255 if value > 96 else 0)
    flattened = (
        ImageEnhance.Color(image.convert("RGB"))
        .enhance(1.12)
        .quantize(
            colors=48,
            method=Image.Quantize.MEDIANCUT,
            dither=Image.Dither.NONE,
        )
        .convert("RGB")
    )
    flattened.putalpha(alpha)

    prepared = source.with_name(f"{source.stem}-vector-source.png")
    flattened.save(prepared, optimize=True)
    try:
        vtracer.convert_image_to_svg_py(
            str(prepared),
            str(output),
            colormode="color",
            hierarchical="cutout",
            mode="spline",
            filter_speckle=6,
            color_precision=6,
            layer_difference=18,
            corner_threshold=75,
            length_threshold=5,
            max_iterations=10,
            splice_threshold=50,
            path_precision=2,
        )
    finally:
        prepared.unlink(missing_ok=True)

    svg = output.read_text(encoding="utf-8")
    svg = svg.replace(
        'width="512" height="512"',
        'viewBox="0 0 512 512" width="512" height="512" '
        'preserveAspectRatio="xMidYMid meet" '
        'shape-rendering="geometricPrecision"',
        1,
    )
    output.write_text(svg, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    sources = sorted(args.input.glob("*.png"))
    if not sources:
        raise SystemExit(f"No PNG sources found in {args.input}")

    for source in sources:
        vectorize(source, args.output / f"{source.stem}.svg")

    print(f"Vectorized {len(sources)} characters into {args.output}")


if __name__ == "__main__":
    main()
