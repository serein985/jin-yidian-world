import { type CSSProperties } from "react";
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

interface StickerPalette {
  fur: string;
  face: string;
  dark: string;
  inner: string;
  blush: string;
  outfit: string;
  outfitDark: string;
  prop: string;
  propDark: string;
}

const OUTLINE = "#44342f";
const SOFT_OUTLINE = "#65504a";

const palettes: Record<PresetAnimalId, StickerPalette> = {
  panda: {
    fur: "#f5edde",
    face: "#fffaf0",
    dark: "#34302e",
    inner: "#6a5750",
    blush: "#e99489",
    outfit: "#df9a84",
    outfitDark: "#a95f55",
    prop: "#79a866",
    propDark: "#527b48",
  },
  "red-panda": {
    fur: "#d98d5d",
    face: "#f8dfc6",
    dark: "#513932",
    inner: "#d97763",
    blush: "#dc7d73",
    outfit: "#8eb49a",
    outfitDark: "#5d826d",
    prop: "#bd5e50",
    propDark: "#7d403a",
  },
  tiger: {
    fur: "#efb45c",
    face: "#ffe8c7",
    dark: "#5a4033",
    inner: "#eead9d",
    blush: "#e98478",
    outfit: "#e37968",
    outfitDark: "#a8504c",
    prop: "#eaa087",
    propDark: "#a75f56",
  },
  sheep: {
    fur: "#f5ecda",
    face: "#efc9b4",
    dark: "#544039",
    inner: "#e7aa9b",
    blush: "#e68b79",
    outfit: "#f2c761",
    outfitDark: "#b98b3f",
    prop: "#df7770",
    propDark: "#9a4c49",
  },
  capybara: {
    fur: "#c69a6e",
    face: "#e3bd91",
    dark: "#513c31",
    inner: "#9e6c52",
    blush: "#d77e6c",
    outfit: "#89aeb4",
    outfitDark: "#587f85",
    prop: "#e9b84f",
    propDark: "#8ca24d",
  },
  rabbit: {
    fur: "#f7f0e4",
    face: "#fffaf1",
    dark: "#4f3d37",
    inner: "#eca99e",
    blush: "#e88f83",
    outfit: "#82b8c4",
    outfitDark: "#4f8995",
    prop: "#b98462",
    propDark: "#755542",
  },
  fox: {
    fur: "#df8752",
    face: "#fff0d9",
    dark: "#543b32",
    inner: "#dc7464",
    blush: "#df766c",
    outfit: "#72a99f",
    outfitDark: "#477e76",
    prop: "#f2c3a8",
    propDark: "#a96959",
  },
  penguin: {
    fur: "#40515a",
    face: "#f8f1e3",
    dark: "#334149",
    inner: "#e8894e",
    blush: "#df806f",
    outfit: "#d9675c",
    outfitDark: "#99463f",
    prop: "#82b9c8",
    propDark: "#4d8291",
  },
};

const thickStroke = {
  stroke: OUTLINE,
  strokeWidth: 6.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const thinStroke = {
  stroke: SOFT_OUTLINE,
  strokeWidth: 3.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Ears({
  presetId,
  palette,
}: {
  presetId: PresetAnimalId;
  palette: StickerPalette;
}) {
  if (presetId === "rabbit") {
    return (
      <>
        <path
          d="M112 138C103 91 111 35 138 27c29-8 39 46 31 92Z"
          fill={palette.fur}
          {...thickStroke}
        />
        <path
          d="M222 126c-2-50 14-88 39-81 26 7 20 61 8 95Z"
          fill={palette.fur}
          {...thickStroke}
        />
        <path
          d="M127 111c-3-36 2-56 15-61 14-5 19 21 19 57Z"
          fill={palette.inner}
        />
        <path
          d="M239 103c0-35 7-49 19-48 12 1 12 28 5 52Z"
          fill={palette.inner}
        />
      </>
    );
  }

  if (presetId === "fox" || presetId === "red-panda") {
    return (
      <>
        <path
          d="m91 143-18-78c-1-8 8-13 14-8l73 54Z"
          fill={palette.fur}
          {...thickStroke}
        />
        <path
          d="m269 143 19-78c2-8-7-13-14-8l-73 54Z"
          fill={palette.fur}
          {...thickStroke}
        />
        <path d="m96 112-5-29 35 30Z" fill={palette.inner} />
        <path d="m264 112 6-29-36 30Z" fill={palette.inner} />
      </>
    );
  }

  if (presetId === "sheep") {
    return (
      <>
        <path
          d="M103 154c-35-10-57 3-57 24 0 23 27 31 62 15Z"
          fill={palette.face}
          {...thickStroke}
        />
        <path
          d="M257 154c35-10 57 3 57 24 0 23-27 31-62 15Z"
          fill={palette.face}
          {...thickStroke}
        />
        <path d="M67 175c6-7 15-9 29-5" fill="none" {...thinStroke} />
        <path d="M293 175c-6-7-15-9-29-5" fill="none" {...thinStroke} />
      </>
    );
  }

  if (presetId === "capybara") {
    return (
      <>
        <ellipse
          cx="95"
          cy="122"
          rx="27"
          ry="21"
          fill={palette.dark}
          {...thickStroke}
        />
        <ellipse
          cx="265"
          cy="122"
          rx="27"
          ry="21"
          fill={palette.dark}
          {...thickStroke}
        />
        <ellipse cx="95" cy="122" rx="10" ry="7" fill={palette.inner} />
        <ellipse cx="265" cy="122" rx="10" ry="7" fill={palette.inner} />
      </>
    );
  }

  if (presetId === "penguin") {
    return (
      <>
        <path d="M141 79c-8-15-4-27 5-33" fill="none" {...thickStroke} />
        <path d="M219 79c8-15 4-27-5-33" fill="none" {...thickStroke} />
      </>
    );
  }

  const isPanda = presetId === "panda";
  return (
    <>
      <circle
        cx="96"
        cy="125"
        r="48"
        fill={isPanda ? palette.dark : palette.fur}
        {...thickStroke}
      />
      <circle
        cx="264"
        cy="125"
        r="48"
        fill={isPanda ? palette.dark : palette.fur}
        {...thickStroke}
      />
      {!isPanda && (
        <>
          <ellipse cx="96" cy="128" rx="22" ry="25" fill={palette.inner} />
          <ellipse cx="264" cy="128" rx="22" ry="25" fill={palette.inner} />
        </>
      )}
    </>
  );
}

function Tail({
  presetId,
  palette,
}: {
  presetId: PresetAnimalId;
  palette: StickerPalette;
}) {
  if (presetId === "red-panda" || presetId === "fox" || presetId === "tiger") {
    const striped = presetId === "red-panda" || presetId === "tiger";
    return (
      <g className="painted-tail">
        <path
          d="M239 363c31 13 59 3 72-18 15-25 1-47-22-42-17 4-15 25-2 27 14 2 18-13 9-21 26 14 19 44-7 54-17 7-34 5-52-2Z"
          fill={palette.fur}
          {...thickStroke}
        />
        {presetId === "fox" && (
          <path
            d="M270 342c17-3 31-10 38-24 4 23-9 39-31 44-11 3-21 1-30-2Z"
            fill={palette.face}
          />
        )}
        {striped && (
          <g fill="none" stroke={palette.dark} strokeWidth="8" strokeLinecap="round">
            <path d="M263 326c9 2 15 1 22-4" />
            <path d="M279 349c9 1 16-1 22-5" />
          </g>
        )}
      </g>
    );
  }

  if (presetId === "penguin" || presetId === "capybara") {
    return null;
  }

  return (
    <g className="painted-tail painted-tail--short">
      <circle
        cx="278"
        cy="365"
        r={presetId === "rabbit" ? 27 : 31}
        fill={presetId === "panda" ? palette.dark : palette.fur}
        {...thickStroke}
      />
    </g>
  );
}

function Body({
  presetId,
  palette,
}: {
  presetId: PresetAnimalId;
  palette: StickerPalette;
}) {
  if (presetId === "sheep") {
    return (
      <g className="painted-body">
        <g fill={palette.fur} {...thickStroke}>
          <circle cx="101" cy="334" r="55" />
          <circle cx="149" cy="306" r="61" />
          <circle cx="213" cy="309" r="60" />
          <circle cx="260" cy="338" r="53" />
          <circle cx="116" cy="380" r="46" />
          <circle cx="180" cy="393" r="51" />
          <circle cx="244" cy="379" r="46" />
        </g>
        <path
          d="M133 333c8-15 30-22 47-22 20 0 39 7 49 22l8 71c-14 15-34 22-57 22-24 0-44-7-58-22Z"
          fill={palette.outfit}
        />
        <path d="M139 335 129 305M221 335l11-29" fill="none" {...thinStroke} />
        <path
          d="M150 365h63c8 0 14 5 15 13l6 47c-16 11-32 16-52 16s-37-6-52-16l6-47c1-8 6-13 14-13Z"
          fill={palette.outfit}
          {...thickStroke}
        />
        <path d="M155 382h18v20c-10 1-16-5-18-20ZM200 382h18c-2 15-8 21-18 20Z" fill="#fff7dd" opacity="0.72" />
        <ellipse cx="128" cy="410" rx="32" ry="16" fill={palette.face} {...thickStroke} />
        <ellipse cx="232" cy="410" rx="32" ry="16" fill={palette.face} {...thickStroke} />
      </g>
    );
  }

  const isPenguin = presetId === "penguin";
  return (
    <g className="painted-body">
      <path
        d="M100 306c-5-32 16-58 80-58s85 26 80 58l2 61c0 33-31 48-82 48s-82-15-82-48Z"
        fill={palette.fur}
        {...thickStroke}
      />

      {isPenguin && (
        <path
          className="painted-belly"
          d="M126 303c6-20 27-30 54-30s48 10 54 30l5 65c-11 24-30 35-59 35s-48-11-59-35Z"
          fill={palette.face}
          {...thickStroke}
        />
      )}
      {presetId === "capybara" && (
        <ellipse cx="180" cy="354" rx="56" ry="50" fill={palette.face} opacity="0.42" />
      )}
      {presetId === "tiger" && (
        <g fill="none" stroke={palette.dark} strokeWidth="8" strokeLinecap="round">
          <path d="M113 304c9 8 17 11 27 13M247 304c-9 8-17 11-27 13" />
        </g>
      )}

      <path
        d="M108 322c-23 7-31 31-22 51 8 19 27 22 46 7"
        fill={palette.fur}
        {...thickStroke}
      />
      <path
        d="M252 322c23 7 31 31 22 51-8 19-27 22-46 7"
        fill={palette.fur}
        {...thickStroke}
      />
      <ellipse
        cx="132"
        cy="410"
        rx="35"
        ry="17"
        fill={isPenguin ? palette.inner : palette.fur}
        {...thickStroke}
      />
      <ellipse
        cx="228"
        cy="410"
        rx="35"
        ry="17"
        fill={isPenguin ? palette.inner : palette.fur}
        {...thickStroke}
      />

      {presetId === "rabbit" && (
        <g>
          <path
            d="M126 309c5-13 22-20 54-20s49 7 54 20l8 67c-14 20-35 30-62 30s-48-10-62-30Z"
            fill={palette.outfit}
            {...thickStroke}
          />
          <path d="M139 315 128 290M221 315l11-25" fill="none" {...thickStroke} />
          <circle cx="137" cy="321" r="4.5" fill="#ffe9ad" />
          <circle cx="223" cy="321" r="4.5" fill="#ffe9ad" />
          <path
            d="M155 346h50c10 0 17 7 18 17l5 39c-12 10-27 15-48 15s-36-5-48-15l5-39c1-10 8-17 18-17Z"
            fill="#edf7f6"
            opacity="0.55"
            stroke={SOFT_OUTLINE}
            strokeWidth="2.6"
          />
          <path d="M166 356h28v22h-28Z" fill="none" stroke={SOFT_OUTLINE} strokeWidth="2.6" />
        </g>
      )}

      {(presetId === "red-panda" || presetId === "fox") && (
        <g>
          <path
            d="M115 300c34 19 96 20 130 0l-4 27c-31 19-91 19-122 0Z"
            fill={palette.outfit}
            {...thickStroke}
          />
          <path
            d="m223 315 39 9c8 2 10 13 3 18l-17 11-20-20Z"
            fill={palette.outfit}
            {...thickStroke}
          />
          <path d="M224 323c15 3 27 8 36 17" fill="none" stroke={palette.outfitDark} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {isPenguin && (
        <g>
          <path
            d="M114 296c35 18 97 19 132 0l-5 25c-31 17-91 17-122 0Z"
            fill={palette.outfit}
            {...thickStroke}
          />
          <path
            d="m225 307 30 20-10 38-20-18Z"
            fill={palette.outfit}
            {...thickStroke}
          />
          <path d="M231 338h18M231 349h16" fill="none" stroke="#f3d7b3" strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {presetId === "capybara" && (
        <path
          d="M123 300c31 16 83 16 114 0l-3 24c-30 15-79 15-108 0Z"
          fill={palette.outfit}
          {...thickStroke}
        />
      )}
    </g>
  );
}

function Head({
  presetId,
  palette,
}: {
  presetId: PresetAnimalId;
  palette: StickerPalette;
}) {
  if (presetId === "capybara") {
    return (
      <path
        d="M78 191c0-73 40-113 102-113s102 40 102 113c0 81-37 121-102 121S78 272 78 191Z"
        fill={palette.fur}
        {...thickStroke}
      />
    );
  }

  if (presetId === "sheep") {
    return (
      <path
        d="M84 189c0-68 38-105 96-105s96 37 96 105c0 82-35 126-96 126S84 271 84 189Z"
        fill={palette.face}
        {...thickStroke}
      />
    );
  }

  return (
    <path
      d="M81 190c0-72 41-113 99-113s99 41 99 113c0 80-37 123-99 123S81 270 81 190Z"
      fill={palette.fur}
      {...thickStroke}
    />
  );
}

function FaceMarkings({
  presetId,
  palette,
}: {
  presetId: PresetAnimalId;
  palette: StickerPalette;
}) {
  if (presetId === "panda") {
    return (
      <>
        <ellipse cx="132" cy="190" rx="34" ry="43" fill={palette.dark} transform="rotate(27 132 190)" />
        <ellipse cx="228" cy="190" rx="34" ry="43" fill={palette.dark} transform="rotate(-27 228 190)" />
      </>
    );
  }

  if (presetId === "red-panda") {
    return (
      <>
        <path
          d="M96 189c15-47 44-69 84-69 39 0 68 22 84 69-17 48-44 72-84 72-39 0-67-24-84-72Z"
          fill={palette.face}
            {...thinStroke}
        />
        <path d="M162 93c-4 29 3 53 18 75 15-22 22-46 18-75Z" fill={palette.face} />
      </>
    );
  }

  if (presetId === "tiger") {
    return (
      <g fill="none" stroke={palette.dark} strokeWidth="8" strokeLinecap="round">
        <path d="M101 145c13-1 24-8 34-19M259 145c-13-1-24-8-34-19" />
        <path d="M90 192h31M239 192h31" />
        <path d="M107 229c11-5 22-5 32 0M221 229c11-5 22-5 32 0" />
      </g>
    );
  }

  if (presetId === "fox") {
    return (
      <>
        <path
          d="M103 214c17-27 41-38 77-38s60 11 77 38c-10 38-35 59-77 59s-67-21-77-59Z"
          fill={palette.face}
          {...thinStroke}
        />
        <path d="M111 160c15 27 38 38 69 38s54-11 69-38" fill="none" stroke={palette.dark} strokeWidth="5" strokeLinecap="round" opacity="0.45" />
      </>
    );
  }

  if (presetId === "penguin") {
    return (
      <>
        <ellipse cx="130" cy="190" rx="49" ry="61" fill={palette.face} stroke={OUTLINE} strokeWidth="5" />
        <ellipse cx="230" cy="190" rx="49" ry="61" fill={palette.face} stroke={OUTLINE} strokeWidth="5" />
      </>
    );
  }

  if (presetId === "sheep") {
    return (
      <>
        <path d="M151 91c-12 13-15 28-8 44 9-4 16-11 20-21 6 9 13 14 22 16 3-18-4-32-20-43Z" fill={palette.fur} stroke={OUTLINE} strokeWidth="4" />
        <path d="M99 206c13-13 28-18 45-14M216 192c17-4 32 1 45 14" fill="none" stroke={palette.inner} strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      </>
    );
  }

  if (presetId === "capybara") {
    return (
      <>
        <ellipse cx="180" cy="223" rx="89" ry="69" fill={palette.face} opacity="0.44" />
        <path d="M147 93c14-16 31-22 52-19-9 17-23 26-43 27 11 7 18 16 21 27-17-1-30-9-40-25Z" fill={palette.dark} opacity="0.2" />
      </>
    );
  }

  if (presetId === "rabbit") {
    return (
      <path d="M105 229c14-24 39-35 75-35s61 11 75 35c-12 34-38 51-75 51s-63-17-75-51Z" fill={palette.face} opacity="0.58" />
    );
  }

  return null;
}

function Eyes({
  presetId,
  palette,
}: {
  presetId: PresetAnimalId;
  palette: StickerPalette;
}) {
  const onDarkPatch = presetId === "panda";
  return (
    <>
      {(["left", "right"] as const).map((side) => {
        const x = side === "left" ? 132 : 228;
        return (
          <g
            key={side}
            className={`painted-eye painted-eye--${side}`}
            data-eye={side}
          >
            <g className="painted-eye__open">
              {onDarkPatch && (
                <ellipse cx={x} cy="190" rx="13" ry="17" fill="#fff9ed" />
              )}
              <ellipse
                className="painted-eye__pupil"
                cx={x}
                cy="190"
                rx={onDarkPatch ? 5.5 : 7}
                ry={onDarkPatch ? 7 : 9.5}
                fill={palette.dark}
              />
              <circle cx={x + 2.5} cy="186.5" r="2" fill="#fffdf6" />
            </g>
            <path
              className="painted-eye__closed"
              d={`M${x - 12} 192c7-9 17-9 24 0`}
              fill="none"
              stroke={palette.dark}
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </>
  );
}

function Mouth({
  presetId,
  palette,
}: {
  presetId: PresetAnimalId;
  palette: StickerPalette;
}) {
  const tinyMuzzle = presetId === "panda";
  return (
    <>
      {!tinyMuzzle && (
        <ellipse
          cx="180"
          cy="230"
          rx={presetId === "penguin" ? 26 : 39}
          ry={presetId === "penguin" ? 19 : 25}
          fill={palette.face}
          stroke={SOFT_OUTLINE}
          strokeWidth="2.4"
          opacity="0.92"
        />
      )}
      {presetId === "penguin" ? (
        <path
          d="M158 226c13-8 31-8 44 0-4 17-13 24-22 24-10 0-18-7-22-24Z"
          fill={palette.inner}
          {...thickStroke}
        />
      ) : (
        <path
          d="M169 221c7-7 15-7 22 0-1 8-5 12-11 12s-10-4-11-12Z"
          fill={palette.dark}
        />
      )}
      {presetId !== "penguin" && (
        <>
          <g className="painted-mouth painted-mouth--calm">
            <path
              d="M180 233c-2 9-8 15-17 16M180 233c2 9 8 15 17 16"
              fill="none"
              stroke={palette.dark}
              strokeWidth="3.6"
              strokeLinecap="round"
            />
          </g>
          <g className="painted-mouth painted-mouth--happy">
            <path
              d="M157 243c15 20 32 20 46 0-4 25-41 25-46 0Z"
              fill="#e9857d"
              stroke={palette.dark}
              strokeWidth="3.4"
              strokeLinejoin="round"
            />
          </g>
          <g className="painted-mouth painted-mouth--eating">
            <path
              d="M164 243c10 8 22 8 32 0-6 13-12 18-16 18s-11-5-16-18Z"
              fill="#d76d67"
              stroke={palette.dark}
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
          </g>
        </>
      )}
      <ellipse cx="101" cy="226" rx="24" ry="11" fill={palette.blush} opacity="0.54" />
      <ellipse cx="259" cy="226" rx="24" ry="11" fill={palette.blush} opacity="0.54" />
      <path d="M89 229h13M93 236h9M258 229h13M258 236h9" stroke={palette.blush} strokeWidth="2.6" strokeLinecap="round" opacity="0.75" />
    </>
  );
}

function HeadDecor({
  presetId,
  palette,
}: {
  presetId: PresetAnimalId;
  palette: StickerPalette;
}) {
  if (presetId === "sheep") {
    return (
      <g className="sticker-head-decor">
        <path
          d="M241 94c-8-22-35-25-44-7-9 18 9 31 43 20Z"
          fill={palette.prop}
          {...thickStroke}
        />
        <path
          d="M253 101c12-20 38-18 43 2 5 20-16 29-46 13Z"
          fill={palette.prop}
          {...thickStroke}
        />
        <path d="M239 102c6-10 18-11 25-1 7 11 1 22-11 24-12 1-20-12-14-23Z" fill={palette.propDark} stroke={OUTLINE} strokeWidth="4" />
        <path d="m239 120-9 19 17-5 9 9 2-20M255 119l12 16 11-13 3 18" fill={palette.prop} stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round" />
      </g>
    );
  }

  if (presetId === "capybara") {
    return (
      <g className="sticker-head-decor">
        <circle cx="181" cy="82" r="25" fill={palette.prop} {...thickStroke} />
        <path d="M166 68c13-9 27-21 42-36 3 17-5 31-25 42Z" fill="#82a95d" stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round" />
        <path d="M179 69c-2 8-1 15 3 22M157 74c-11 0-19 5-24 13M204 75c12 1 21 7 25 15" fill="none" stroke="#b27b35" strokeWidth="2.3" strokeLinecap="round" />
      </g>
    );
  }

  if (presetId === "tiger") {
    return (
      <path
        className="sticker-head-decor"
        d="m222 85 7 14 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2Z"
        fill="#f4d364"
        stroke={OUTLINE}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    );
  }

  return null;
}

function Accessory({
  presetId,
  palette,
}: {
  presetId: PresetAnimalId;
  palette: StickerPalette;
}) {
  if (presetId === "panda") {
    return (
      <g
        className="doodle-accessory"
        data-sticker-accessory={presetId}
        transform="translate(225 327) rotate(7)"
      >
        <path d="M13 68C12 37 19 13 37-12" fill="none" stroke={palette.propDark} strokeWidth="21" strokeLinecap="round" />
        <path d="M13 68C12 37 19 13 37-12" fill="none" stroke="#a6c776" strokeWidth="13" strokeLinecap="round" />
        <path d="M23 34c-1 17-1 29 1 42M25 18c0 12 0 23 1 34" fill="none" stroke="#dce7a3" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M23 20C5 16-2 3 1-11c15 2 23 11 22 31Z" fill="#7da85e" stroke={OUTLINE} strokeWidth="4" />
        <path d="M28 34c17-7 29-3 35 12-17 8-29 4-35-12Z" fill="#84ae62" stroke={OUTLINE} strokeWidth="4" />
        <path d="M20 48C4 45-2 35 1 24c13 1 20 9 19 24Z" fill="#90b76e" stroke={OUTLINE} strokeWidth="4" />
        <ellipse cx="7" cy="60" rx="17" ry="13" fill={palette.fur} {...thickStroke} />
      </g>
    );
  }

  if (presetId === "red-panda") {
    return (
      <g
        className="doodle-accessory"
        data-sticker-accessory={presetId}
        transform="translate(216 348)"
      >
        <path d="M-26 5h77c-4 30-16 45-38 45-23 0-35-15-39-45Z" fill="#e8ad81" {...thickStroke} />
        <path d="M-18 12h62" stroke="#f7dcc2" strokeWidth="8" strokeLinecap="round" />
        <circle cx="-3" cy="2" r="12" fill={palette.prop} {...thickStroke} />
        <circle cx="18" cy="-4" r="13" fill="#a95862" {...thickStroke} />
        <circle cx="36" cy="4" r="11" fill="#e7a84b" {...thickStroke} />
        <path d="M-3-9c4-7 9-9 14-7M18-16c3-5 7-7 12-6" fill="none" stroke="#698553" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="-21" cy="39" rx="14" ry="11" fill={palette.fur} {...thickStroke} />
        <ellipse cx="45" cy="39" rx="14" ry="11" fill={palette.fur} {...thickStroke} />
      </g>
    );
  }

  if (presetId === "tiger") {
    return (
      <g
        className="doodle-accessory"
        data-sticker-accessory={presetId}
        transform="translate(221 360) rotate(-5)"
      >
        <path
          d="M0-35c27 0 49 22 49 49 0 27-22 48-49 48S-49 41-49 14C-49-13-27-35 0-35Zm0 26a23 23 0 1 0 0 46 23 23 0 0 0 0-46Z"
          fill="#d2915e"
          fillRule="evenodd"
          {...thickStroke}
        />
        <path
          d="M-42 9c5-25 24-41 48-41 22 0 39 12 45 31-11 8-24-1-35 3-12 5-15 17-29 15-11-2-15 5-26 8-7-4-7-10-3-16Z"
          fill={palette.prop}
        />
        <path d="m-24-6 8 3M-7-18l8 4M12-8l7 4M25 7l-2 8M-30 15l8 4" stroke="#fff3d3" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="-38" cy="46" rx="14" ry="11" fill={palette.fur} {...thickStroke} />
        <ellipse cx="39" cy="46" rx="14" ry="11" fill={palette.fur} {...thickStroke} />
      </g>
    );
  }

  if (presetId === "sheep") {
    return (
      <g
        className="doodle-accessory"
        data-sticker-accessory={presetId}
        transform="translate(238 343) rotate(7)"
      >
        <path d="M0 55C-1 33 0 17 3 0" fill="none" stroke={palette.propDark} strokeWidth="5" strokeLinecap="round" />
        <path d="M3 14c-16-10-25-5-28 7 15 10 25 6 28-7ZM4 30c16-10 27-5 30 7-16 10-27 6-30-7Z" fill="#7fa362" stroke={OUTLINE} strokeWidth="3.5" />
        <g transform="translate(4 -5)">
          {[0, 72, 144, 216, 288].map((rotation) => (
            <ellipse key={rotation} cx="0" cy="-14" rx="10" ry="15" fill={palette.prop} stroke={OUTLINE} strokeWidth="3" transform={`rotate(${rotation})`} />
          ))}
          <circle r="8" fill="#f5d36a" stroke={OUTLINE} strokeWidth="3" />
        </g>
        <ellipse cx="-20" cy="46" rx="14" ry="11" fill={palette.face} {...thickStroke} />
        <ellipse cx="40" cy="45" rx="14" ry="11" fill={palette.face} {...thickStroke} />
      </g>
    );
  }

  if (presetId === "capybara") {
    return (
      <g
        className="doodle-accessory"
        data-sticker-accessory={presetId}
        transform="translate(217 350)"
      >
        <path d="M-28 8h87l-7 44c-21 15-51 15-72 0Z" fill="#85aeb8" {...thickStroke} />
        <path d="M-22 20h75" stroke="#d8edf0" strokeWidth="7" strokeLinecap="round" />
        <path d="M-9 42h45" stroke="#628a94" strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
        <circle cx="-8" cy="-7" r="15" fill={palette.prop} {...thickStroke} />
        <path d="M-14-20c7-10 16-9 22-2-7 7-14 8-22 2Z" fill="#7da45f" stroke={OUTLINE} strokeWidth="3.5" />
        <ellipse cx="-27" cy="47" rx="14" ry="11" fill={palette.face} {...thickStroke} />
        <ellipse cx="46" cy="47" rx="14" ry="11" fill={palette.face} {...thickStroke} />
      </g>
    );
  }

  if (presetId === "rabbit") {
    return (
      <g
        className="doodle-accessory"
        data-sticker-accessory={presetId}
        transform="translate(238 336) rotate(6)"
      >
        <path d="M-22-8h55l-6 73h-43Z" fill={palette.prop} {...thickStroke} />
        <path d="M-17-28h45l-1 22h-43Z" fill="#f8e9cf" stroke={OUTLINE} strokeWidth="5" strokeLinejoin="round" />
        <path d="M-4-7v69M17-7v69M-20 32h50" stroke="#8b5d46" strokeWidth="5" strokeLinecap="round" opacity="0.72" />
        <g fill="#6e493b">
          <circle cx="-6" cy="62" r="5.5" />
          <circle cx="2" cy="58" r="5" />
          <circle cx="11" cy="63" r="5.5" />
          <circle cx="20" cy="57" r="4.5" />
        </g>
        <path d="M-13-29c2-17 20-19 25-3" fill="none" stroke="#74aeb9" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="-30" cy="48" rx="15" ry="11" fill={palette.fur} {...thickStroke} />
        <ellipse cx="41" cy="47" rx="15" ry="11" fill={palette.fur} {...thickStroke} />
      </g>
    );
  }

  if (presetId === "fox") {
    return (
      <g
        className="doodle-accessory"
        data-sticker-accessory={presetId}
        transform="translate(217 355) rotate(-4)"
      >
        <path d="M-41 0h82v56c-16 13-66 13-82 0Z" fill="#f5e5d1" {...thickStroke} />
        <path d="m-40 1 40 34L40 1" fill="none" stroke={OUTLINE} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9-22c7-16 27-13 29 2 12-6 23 4 19 16-4 11-17 13-29 6-11 9-24 8-30-1-7-10 0-20 11-23Z" fill={palette.prop} stroke={OUTLINE} strokeWidth="4" />
        <ellipse cx="-40" cy="43" rx="14" ry="11" fill={palette.fur} {...thickStroke} />
        <ellipse cx="40" cy="43" rx="14" ry="11" fill={palette.fur} {...thickStroke} />
      </g>
    );
  }

  return (
    <g
      className="doodle-accessory"
      data-sticker-accessory={presetId}
      transform="translate(211 353) rotate(5)"
    >
      <path
        d="M-37-2c24-25 58-22 72 2 12 22-2 43-26 41-12-1-17-10-25-9-13 1-24 2-33-7-8-8-2-18 12-27Z"
        fill={palette.prop}
        {...thickStroke}
      />
      <path d="m29-1 35-18-7 21 8 18-36-13Z" fill="#dce9dc" stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round" />
      <path d="m32 7 22 1" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
      <circle cx="-21" cy="4" r="6" fill={OUTLINE} />
      <path d="M-10 14c7 4 14 3 20-1" fill="none" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="-31" cy="42" rx="14" ry="11" fill={palette.fur} {...thickStroke} />
      <ellipse cx="39" cy="42" rx="14" ry="11" fill={palette.fur} {...thickStroke} />
    </g>
  );
}

function Doodles({ palette }: { palette: StickerPalette }) {
  return (
    <g className="painted-doodles" aria-hidden="true">
      <path
        d="M48 142c-12-12 5-29 16-17 11-14 30 3 18 16l-17 18Z"
        fill="none"
        stroke={palette.blush}
        strokeWidth="3.5"
        strokeLinejoin="round"
        transform="rotate(-12 65 139)"
      />
      <path
        d="m87 77 4 11 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2Z"
        fill="#efca6d"
        stroke={OUTLINE}
        strokeWidth="2.4"
        strokeLinejoin="round"
        transform="rotate(-8 88 90)"
      />
      <g className="painted-note" fill="none" stroke={OUTLINE} strokeWidth="2.8" strokeLinecap="round">
        <path d="M294 176c13-2 19 6 20 18l3-41" />
        <path d="M314 154c9 1 12 6 10 12" />
        <ellipse cx="293" cy="179" rx="8" ry="6" fill={palette.blush} stroke={OUTLINE} />
      </g>
      <g fill="none" stroke={palette.outfitDark} strokeWidth="2.8" strokeLinecap="round">
        <path d="M49 252c9 0 15 5 17 13M57 252v29" />
        <path d="M308 256v21M299 266h18" />
        <path d="M59 331c8-2 13 1 15 8" />
      </g>
      <circle cx="309" cy="124" r="4" fill={palette.outfitDark} opacity="0.65" />
      <circle cx="76" cy="300" r="3.5" fill={palette.blush} opacity="0.7" />
      <circle cx="294" cy="311" r="4" fill="#d8a154" opacity="0.72" />
    </g>
  );
}

export function PaintedAnimal({
  presetId,
  mood = "idle",
  lookX = 0,
  lookY = 0,
  compact = false,
}: PaintedAnimalProps) {
  const preset = PRESET_ANIMALS_BY_ID[presetId];
  const palette = palettes[presetId];
  const style = {
    "--painted-look-x": `${lookX * 4}px`,
    "--painted-look-y": `${lookY * 3}px`,
  } as CSSProperties;

  return (
    <svg
      className={`painted-animal painted-animal--${presetId} painted-mood--${mood} ${
        compact ? "is-compact" : ""
      }`}
      style={style}
      viewBox={compact ? "42 22 276 386" : "0 0 360 440"}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`${preset.species}${preset.name}的手绘贴纸插画`}
      data-art-style="hand-drawn-sticker"
      data-preset-id={presetId}
    >
      <ellipse
        className="painted-ground"
        cx="181"
        cy="424"
        rx="104"
        ry="12"
        fill="#8c7565"
        opacity="0.16"
      />

      <g className="painted-character">
        <Tail presetId={presetId} palette={palette} />
        <Ears presetId={presetId} palette={palette} />
        <Body presetId={presetId} palette={palette} />

        <g className="painted-head">
          <Head presetId={presetId} palette={palette} />
          <FaceMarkings presetId={presetId} palette={palette} />
          <Eyes presetId={presetId} palette={palette} />
          <Mouth presetId={presetId} palette={palette} />
          <HeadDecor presetId={presetId} palette={palette} />
        </g>

        <Accessory presetId={presetId} palette={palette} />
      </g>

      {!compact && <Doodles palette={palette} />}
    </svg>
  );
}
