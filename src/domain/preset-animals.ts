import type { CouponOfferId } from "./coupons";

export const PRESET_ANIMAL_IDS = [
  "panda",
  "red-panda",
  "tiger",
  "sheep",
  "capybara",
  "rabbit",
  "fox",
  "penguin",
] as const;

export type PresetAnimalId = (typeof PRESET_ANIMAL_IDS)[number];
export type EarStyle = "round" | "pointed" | "long" | "small" | "floppy";
export type TailStyle = "short" | "ringed" | "tiger" | "fluffy" | "fox" | "penguin";
export type PatternStyle = "none" | "panda" | "tiger" | "mask";
export type TouchEffect =
  | "bounce"
  | "shake"
  | "sparkle"
  | "hearts"
  | "short-clip";

export interface PresetAnimalDefinition {
  id: PresetAnimalId;
  name: string;
  species: string;
  threshold: number;
  couponOfferId: CouponOfferId;
  tagline: string;
  habitat: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    inner: string;
    eye: string;
  };
  model: {
    bodyScale: [number, number, number];
    headScale: [number, number, number];
    snoutScale: [number, number, number];
    earStyle: EarStyle;
    tailStyle: TailStyle;
    pattern: PatternStyle;
  };
  foods: [string, string, string];
  responses: string[];
}

export const PRESET_ANIMALS: PresetAnimalDefinition[] = [
  {
    id: "panda",
    name: "糯糯",
    species: "大熊猫",
    threshold: 35,
    couponOfferId: "merch",
    tagline: "慢吞吞地靠近，也想被认真看见。",
    habitat: "雾竹坡",
    palette: {
      primary: "#f4eee1",
      secondary: "#252c27",
      accent: "#c99588",
      inner: "#d8b2a8",
      eye: "#4c3229",
    },
    model: {
      bodyScale: [1.1, 1.18, 0.9],
      headScale: [1.12, 1, 1],
      snoutScale: [0.72, 0.48, 0.5],
      earStyle: "round",
      tailStyle: "short",
      pattern: "panda",
    },
    foods: ["嫩竹笋", "苹果片", "竹叶小卷"],
    responses: ["耳朵轻轻动了一下。", "糯糯把爪子搭了过来。", "这里的竹子很香。"],
  },
  {
    id: "red-panda",
    name: "栗栗",
    species: "小熊猫",
    threshold: 30,
    couponOfferId: "merch",
    tagline: "尾巴蓬松，好奇心比脚步更快。",
    habitat: "树枝转角",
    palette: {
      primary: "#b96845",
      secondary: "#f1d5bd",
      accent: "#d98e83",
      inner: "#e9b6a9",
      eye: "#57362b",
    },
    model: {
      bodyScale: [0.92, 1, 0.8],
      headScale: [1, 0.9, 0.92],
      snoutScale: [0.62, 0.42, 0.46],
      earStyle: "pointed",
      tailStyle: "ringed",
      pattern: "mask",
    },
    foods: ["嫩竹笋", "苹果片", "小浆果"],
    responses: ["栗栗把尾巴绕了过来。", "耳朵轻轻抖了一下。", "再慢一点，我听着呢。"],
  },
  {
    id: "tiger",
    name: "阿呜",
    species: "小老虎",
    threshold: 50,
    couponOfferId: "dining",
    tagline: "把爪子收好，只用脑袋轻轻碰你。",
    habitat: "暖石台",
    palette: {
      primary: "#dca450",
      secondary: "#60412b",
      accent: "#e5b29f",
      inner: "#e6a69b",
      eye: "#4e382a",
    },
    model: {
      bodyScale: [1.02, 1.04, 0.86],
      headScale: [1.05, 0.94, 0.96],
      snoutScale: [0.7, 0.44, 0.48],
      earStyle: "round",
      tailStyle: "tiger",
      pattern: "tiger",
    },
    foods: ["鸡肉块", "牛肉粒", "营养肉泥"],
    responses: ["低低的呼噜声冒了出来。", "阿呜把脑袋偏了过来。", "只靠近一点点。"],
  },
  {
    id: "sheep",
    name: "棉棉",
    species: "小羊",
    threshold: 40,
    couponOfferId: "experience",
    tagline: "羊毛软软的，今天也愿意靠近你。",
    habitat: "云朵草坡",
    palette: {
      primary: "#f1ead9",
      secondary: "#e4b3aa",
      accent: "#d98f89",
      inner: "#e9bfb6",
      eye: "#503a32",
    },
    model: {
      bodyScale: [1.08, 0.96, 0.96],
      headScale: [0.94, 0.86, 0.9],
      snoutScale: [0.62, 0.4, 0.44],
      earStyle: "floppy",
      tailStyle: "fluffy",
      pattern: "none",
    },
    foods: ["苜蓿草", "胡萝卜片", "谷物饼干"],
    responses: ["棉棉往你的手边蹭了蹭。", "羊毛软软地陷下去。", "咩，今天也很高兴。"],
  },
  {
    id: "capybara",
    name: "泡芙",
    species: "水豚",
    threshold: 25,
    couponOfferId: "dining",
    tagline: "世界很吵，泡芙只想安静地泡一会儿。",
    habitat: "温水湾",
    palette: {
      primary: "#a9825c",
      secondary: "#d8b88e",
      accent: "#c78d7f",
      inner: "#d9ad98",
      eye: "#3f3128",
    },
    model: {
      bodyScale: [1.18, 1, 1],
      headScale: [0.96, 0.84, 0.92],
      snoutScale: [0.78, 0.48, 0.54],
      earStyle: "small",
      tailStyle: "short",
      pattern: "none",
    },
    foods: ["嫩草束", "南瓜片", "苹果块"],
    responses: ["泡芙眯起眼睛，呼吸慢了下来。", "头顶的小耳朵动了动。", "今天的温水刚刚好。"],
  },
  {
    id: "rabbit",
    name: "米粒",
    species: "兔子",
    threshold: 20,
    couponOfferId: "photo",
    tagline: "长耳朵先听见你，再慢慢跳过来。",
    habitat: "月光草径",
    palette: {
      primary: "#f5f0e8",
      secondary: "#d7c8b6",
      accent: "#e2a29b",
      inner: "#efbbb3",
      eye: "#533c34",
    },
    model: {
      bodyScale: [0.9, 1, 0.84],
      headScale: [0.9, 0.88, 0.9],
      snoutScale: [0.58, 0.38, 0.42],
      earStyle: "long",
      tailStyle: "short",
      pattern: "none",
    },
    foods: ["提摩西草", "胡萝卜片", "苹果枝"],
    responses: ["米粒的长耳朵转向了你。", "鼻尖轻轻碰了碰空气。", "再靠近一点也没关系。"],
  },
  {
    id: "fox",
    name: "小焰",
    species: "狐狸",
    threshold: 45,
    couponOfferId: "drink",
    tagline: "尾巴像一簇火，靠近时却很温柔。",
    habitat: "赤叶林缘",
    palette: {
      primary: "#c56b3f",
      secondary: "#f2dfc9",
      accent: "#b85242",
      inner: "#e5a79b",
      eye: "#4c3028",
    },
    model: {
      bodyScale: [0.96, 1.02, 0.82],
      headScale: [0.98, 0.9, 0.92],
      snoutScale: [0.64, 0.4, 0.52],
      earStyle: "pointed",
      tailStyle: "fox",
      pattern: "none",
    },
    foods: ["鸡肉条", "南瓜块", "蓝莓"],
    responses: ["小焰的尾巴轻轻扫过地面。", "狐狸耳朵向后收了收。", "今天也愿意靠近你。"],
  },
  {
    id: "penguin",
    name: "豆丁",
    species: "企鹅",
    threshold: 30,
    couponOfferId: "experience",
    tagline: "走路摇摇晃晃，靠近你时却很认真。",
    habitat: "极光浅湾",
    palette: {
      primary: "#293b46",
      secondary: "#f3eee1",
      accent: "#e49a59",
      inner: "#d9a878",
      eye: "#30353a",
    },
    model: {
      bodyScale: [0.88, 1.1, 0.8],
      headScale: [0.9, 0.9, 0.9],
      snoutScale: [0.34, 0.25, 0.58],
      earStyle: "small",
      tailStyle: "penguin",
      pattern: "none",
    },
    foods: ["小鱼", "虾仁", "饲养员冰块"],
    responses: ["豆丁左右晃了晃。", "圆圆的肚子贴近了一点。", "鳍状小手拍了拍你。"],
  },
];

export const PRESET_ANIMALS_BY_ID = Object.fromEntries(
  PRESET_ANIMALS.map((animal) => [animal.id, animal]),
) as Record<PresetAnimalId, PresetAnimalDefinition>;

export const DEFAULT_PRESET_IDS: PresetAnimalId[] = [
  "red-panda",
  "tiger",
  "sheep",
];
