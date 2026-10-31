import { useId, type CSSProperties } from "react";
import { getModelConfig } from "./animal3d/model-configs";
import type { PresetAnimalId } from "../domain/preset-animals";

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
  lookX = 0,
  lookY = 0,
  compact = false,
}: PaintedAnimalProps) {
  const config = getModelConfig(presetId);
  const id = useId().replaceAll(":", "");
  const fur = `fur-${id}`;
  const face = `face-${id}`;
  const eye = `eye-${id}`;
  const shadow = `shadow-${id}`;
  const fluffy = presetId === "sheep";
  const penguin = presetId === "penguin";
  const panda = presetId === "panda";
  const tiger = presetId === "tiger";
  const fox = presetId === "fox";
  const rabbit = presetId === "rabbit";
  const capybara = presetId === "capybara";
  const redPanda = presetId === "red-panda";
  const style = {
    "--painted-look-x": `${lookX * 7}px`,
    "--painted-look-y": `${lookY * 5}px`,
  } as CSSProperties;

  return (
    <svg
      className={`painted-animal painted-animal--${presetId} painted-mood--${mood} ${
        compact ? "is-compact" : ""
      }`}
      style={style}
      viewBox="0 0 360 420"
      role="img"
      aria-label={presetId}
    >
      <defs>
        <radialGradient id={fur} cx="36%" cy="24%" r="76%">
          <stop offset="0" stopColor={config.primary} stopOpacity="0.72" />
          <stop offset="0.35" stopColor={config.primary} />
          <stop offset="1" stopColor={config.secondary} />
        </radialGradient>
        <radialGradient id={face} cx="45%" cy="30%" r="72%">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.58" stopColor="#f4d8ce" />
          <stop offset="1" stopColor="#dfa99e" />
        </radialGradient>
        <radialGradient id={eye} cx="35%" cy="28%" r="70%">
          <stop offset="0" stopColor="#7a4d3d" />
          <stop offset="0.72" stopColor="#422b25" />
          <stop offset="1" stopColor="#211713" />
        </radialGradient>
        <filter id={shadow} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
      </defs>

      <ellipse cx="180" cy="390" rx="122" ry="17" fill="#254331" opacity="0.22" filter={`url(#${shadow})`} />

      <g className="painted-tail">
        {redPanda && (
          <g>
            <path d="M240 305c86-14 105-65 70-101-26-27-61-3-41 21 12 15 35 6 28-9 21 24-8 49-58 55Z" fill={`url(#${fur})`} />
            <path d="M280 222c13-4 23-2 31 3M272 250c11-3 22-1 31 3" fill="none" stroke="#734735" strokeWidth="11" strokeLinecap="round" opacity="0.55" />
          </g>
        )}
        {tiger && (
          <path d="M238 318c79 23 102-27 68-66-20-23-51-6-34 17 11 15 33 5 25-10 22 22-3 45-53 42Z" fill={`url(#${fur})`} stroke="#856038" strokeWidth="5" />
        )}
        {fox && (
          <path d="M233 316c74-3 101-52 71-88-18-21-44-9-31 12 8 14 31 8 26-7 17 22-2 46-53 55Z" fill={`url(#${fur})`} />
        )}
        {!redPanda && !tiger && !fox && (
          <ellipse cx="264" cy="335" rx="38" ry="32" fill={`url(#${fur})`} />
        )}
      </g>

      <g className="painted-body">
        {fluffy ? (
          <g className="painted-wool">
            {[
              [90, 316, 70], [143, 290, 83], [213, 292, 82],
              [269, 326, 61], [76, 357, 51], [154, 365, 68],
              [235, 369, 62], [311, 361, 36],
            ].map(([cx, cy, r], index) => (
              <circle key={index} cx={cx} cy={cy} r={r} fill={`url(#${fur})`} />
            ))}
            <ellipse cx="183" cy="369" rx="99" ry="52" fill="#f1eadc" opacity="0.7" />
            <ellipse cx="148" cy="400" rx="25" ry="12" fill="#e8b5ad" />
            <ellipse cx="214" cy="400" rx="25" ry="12" fill="#e8b5ad" />
          </g>
        ) : (
          <>
            <ellipse cx="180" cy="327" rx="103" ry="90" fill={`url(#${fur})`} />
            <ellipse cx="180" cy="344" rx="58" ry="66" fill={penguin ? "#f8f2e4" : config.secondary} opacity={panda || fox ? 0.85 : 0.65} />
            <ellipse cx="94" cy="343" rx="46" ry="70" fill={panda ? config.secondary : config.primary} transform="rotate(24 94 343)" />
            <ellipse cx="266" cy="343" rx="46" ry="70" fill={panda ? config.secondary : config.primary} transform="rotate(-24 266 343)" />
            <ellipse cx="131" cy="397" rx="42" ry="20" fill={panda ? config.secondary : config.primary} />
            <ellipse cx="229" cy="397" rx="42" ry="20" fill={panda ? config.secondary : config.primary} />
          </>
        )}
      </g>

      <g className="painted-head">
        {rabbit ? (
          <g>
            <ellipse cx="123" cy="79" rx="33" ry="89" fill={`url(#${fur})`} transform="rotate(-10 123 79)" />
            <ellipse cx="237" cy="79" rx="33" ry="89" fill={`url(#${fur})`} transform="rotate(10 237 79)" />
            <ellipse cx="123" cy="80" rx="14" ry="59" fill={config.inner} transform="rotate(-10 123 80)" />
            <ellipse cx="237" cy="80" rx="14" ry="59" fill={config.inner} transform="rotate(10 237 80)" />
          </g>
        ) : fox || redPanda ? (
          <g>
            <path d="M85 146 111 66l49 50Z" fill={`url(#${fur})`} />
            <path d="m224 112 49-49 18 83Z" fill={`url(#${fur})`} />
            <path d="m106 102 16-21 24 30Z" fill={config.inner} />
            <path d="m240 103 19-22 7 31Z" fill={config.inner} />
          </g>
        ) : (
          <g>
            <circle cx="104" cy="130" r={panda ? 48 : 42} fill={panda ? config.secondary : `url(#${fur})`} />
            <circle cx="256" cy="130" r={panda ? 48 : 42} fill={panda ? config.secondary : `url(#${fur})`} />
            <circle cx="104" cy="132" r="21" fill={config.inner} opacity="0.65" />
            <circle cx="256" cy="132" r="21" fill={config.inner} opacity="0.65" />
          </g>
        )}

        <path
          d={
            fluffy
              ? "M72 196c0-77 43-127 108-127s108 50 108 127c0 76-42 119-108 119S72 272 72 196Z"
              : penguin
                ? "M88 193c0-72 39-119 92-119s92 47 92 119c0 72-36 113-92 113s-92-41-92-113Z"
                : "M82 190c0-73 40-117 98-117s98 44 98 117c0 76-38 121-98 121S82 266 82 190Z"
          }
          fill={penguin ? config.primary : `url(#${fur})`}
        />

        {panda && (
          <>
            <ellipse cx="132" cy="186" rx="38" ry="48" fill={config.secondary} transform="rotate(31 132 186)" />
            <ellipse cx="228" cy="186" rx="38" ry="48" fill={config.secondary} transform="rotate(-31 228 186)" />
          </>
        )}
        {(fluffy || redPanda || fox) && (
          <ellipse cx="180" cy="215" rx="89" ry="67" fill={`url(#${face})`} opacity={redPanda ? 0.8 : 0.72} />
        )}
        {penguin && (
          <>
            <ellipse cx="130" cy="188" rx="48" ry="58" fill="#fbf5e8" />
            <ellipse cx="230" cy="188" rx="48" ry="58" fill="#fbf5e8" />
          </>
        )}
        {tiger && (
          <g fill="none" stroke={config.secondary} strokeLinecap="round" strokeWidth="11" opacity="0.78">
            <path d="M104 145c16-7 28-17 38-31M216 114c12 17 25 27 41 33M92 189c15-5 27-4 39 1M230 189c15-5 27-3 39 2" />
          </g>
        )}

        <g className="painted-eye painted-eye--left">
          <ellipse cx="132" cy="191" rx="34" ry="45" fill="#fffdf8" />
          <ellipse cx="134" cy="194" rx="23" ry="34" fill={`url(#${eye})`} />
          <circle cx="142" cy="179" r="9" fill="#fff" />
          <circle cx="126" cy="207" r="4" fill="#fff" opacity="0.86" />
          <path d="M103 162c-12-8-20-17-25-28M100 174c-14-5-24-12-32-22M102 188c-13-1-24-4-34-11" fill="none" stroke="#4a302a" strokeLinecap="round" strokeWidth="3" />
        </g>
        <g className="painted-eye painted-eye--right">
          <ellipse cx="228" cy="191" rx="34" ry="45" fill="#fffdf8" />
          <ellipse cx="226" cy="194" rx="23" ry="34" fill={`url(#${eye})`} />
          <circle cx="234" cy="179" r="9" fill="#fff" />
          <circle cx="218" cy="207" r="4" fill="#fff" opacity="0.86" />
          <path d="M257 162c12-8 20-17 25-28M260 174c14-5 24-12 32-22M258 188c13-1 24-4 34-11" fill="none" stroke="#4a302a" strokeLinecap="round" strokeWidth="3" />
        </g>

        <ellipse cx="180" cy="238" rx={penguin ? 20 : 35} ry={penguin ? 16 : 24} fill={fox || fluffy || redPanda ? "#f6e5d9" : "#f1dfcd"} />
        {penguin ? (
          <path d="M157 231c14-6 32-6 46 0-5 18-15 25-23 25s-18-7-23-25Z" fill="#e99b50" />
        ) : (
          <path d="M169 228c7-7 15-7 22 0-1 8-5 12-11 12s-10-4-11-12Z" fill="#50342f" />
        )}
        {!penguin && (
          <>
            <path className="painted-mouth painted-mouth--calm" d="M180 241c-2 11-8 17-18 18M180 241c2 11 8 17 18 18" fill="none" stroke="#775148" strokeLinecap="round" strokeWidth="3" />
            <path className="painted-mouth painted-mouth--happy" d="M157 250c14 18 32 18 46 0" fill="#955c54" stroke="#775148" strokeWidth="3" />
            <path className="painted-mouth painted-mouth--eating" d="M166 247c8 7 20 7 28 0" fill="#8c514c" stroke="#775148" strokeWidth="3" />
          </>
        )}
        <ellipse cx="98" cy="235" rx="25" ry="11" fill="#e99488" opacity="0.3" />
        <ellipse cx="262" cy="235" rx="25" ry="11" fill="#e99488" opacity="0.3" />
        {fluffy && <path d="M165 111c-7 15-5 28 7 40 9-14 10-28 2-40Z" fill="#fffaf0" opacity="0.84" />}
        {capybara && <path d="M118 118c20-20 43-25 62-17-16 19-36 30-62 17Z" fill="#b68c66" opacity="0.55" />}
      </g>

      <g className="painted-sparkles" aria-hidden="true">
        <circle cx="70" cy="166" r="4" fill="#fff5cf" opacity="0.7" />
        <circle cx="292" cy="132" r="3" fill="#fff5cf" opacity="0.6" />
        <circle cx="303" cy="272" r="5" fill="#fff5cf" opacity="0.42" />
      </g>
    </svg>
  );
}
