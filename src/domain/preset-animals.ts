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
  "bear-pie",
  "mirror-rabbit",
  "pig",
  "book-dog",
] as const;

export type PresetAnimalId = (typeof PRESET_ANIMAL_IDS)[number];
export type EarStyle = "round" | "pointed" | "long" | "small" | "floppy";
export type TailStyle = "short" | "ringed" | "tiger" | "fluffy" | "fox" | "penguin";
export type PatternStyle = "none" | "panda" | "tiger" | "mask";
export type StickerMotion =
  | "bob"
  | "sway"
  | "munch"
  | "sleep"
  | "hop"
  | "peek"
  | "sip"
  | "nod";
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
  artMotion: StickerMotion;
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
    species: "小白熊",
    threshold: 35,
    couponOfferId: "merch",
    tagline: "抱着一朵小花，慢吞吞地等你来。",
    habitat: "花绒坡",
    artMotion: "bob",
    palette: {
      primary: "#f5eee3",
      secondary: "#83b9c6",
      accent: "#e99b91",
      inner: "#f1b9b1",
      eye: "#4b3832",
    },
    model: {
      bodyScale: [1.04, 1.08, 0.9],
      headScale: [1.1, 0.98, 1],
      snoutScale: [0.62, 0.4, 0.46],
      earStyle: "round",
      tailStyle: "short",
      pattern: "none",
    },
    foods: ["蜂蜜饼干", "苹果片", "小蓝莓"],
    responses: ["糯糯把小花举高了一点。", "圆耳朵轻轻动了一下。", "今天也想和你待一会儿。"],
  },
  {
    id: "red-panda",
    name: "栗栗",
    species: "小橘猫",
    threshold: 30,
    couponOfferId: "merch",
    tagline: "捧着甜甜圈，好奇心比脚步更快。",
    habitat: "甜点街角",
    artMotion: "munch",
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
    foods: ["小鱼干", "奶油饼干", "草莓"],
    responses: ["栗栗把甜甜圈抱得更紧了。", "尾巴开心地翘了起来。", "再靠近一点，我想听。"],
  },
  {
    id: "tiger",
    name: "阿呜",
    species: "小老虎",
    threshold: 50,
    couponOfferId: "dining",
    tagline: "抱着小饼干，也会认真听你说话。",
    habitat: "暖石台",
    artMotion: "hop",
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
    foods: ["鸡肉块", "牛肉粒", "小饼干"],
    responses: ["阿呜咬了一口小饼干。", "脑袋轻轻偏了过来。", "只靠近一点点。"],
  },
  {
    id: "sheep",
    name: "棉棉",
    species: "小羊",
    threshold: 40,
    couponOfferId: "experience",
    tagline: "羊毛软软的，今天也愿意靠近你。",
    habitat: "云朵草坡",
    artMotion: "sway",
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
    tagline: "软软地打个哈欠，就能陪你很久。",
    habitat: "午后软垫",
    artMotion: "sleep",
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
    foods: ["小肉丸", "南瓜片", "酸奶饼干"],
    responses: ["泡芙眯起眼睛，呼吸慢了下来。", "蓝色小领巾轻轻晃动。", "今天的软垫刚刚好。"],
  },
  {
    id: "rabbit",
    name: "米粒",
    species: "兔子",
    threshold: 20,
    couponOfferId: "photo",
    tagline: "抱着奶茶先听见你，再慢慢跳过来。",
    habitat: "月光草径",
    artMotion: "sip",
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
    species: "小鹿",
    threshold: 45,
    couponOfferId: "drink",
    tagline: "围巾暖乎乎的，靠近时却很温柔。",
    habitat: "赤叶林缘",
    artMotion: "peek",
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
    foods: ["苹果块", "胡萝卜条", "燕麦饼干"],
    responses: ["小焰把杯子捧得更稳了。", "鹿角轻轻蹭了蹭空气。", "今天也愿意靠近你。"],
  },
  {
    id: "penguin",
    name: "豆丁",
    species: "小鼠",
    threshold: 30,
    couponOfferId: "experience",
    tagline: "抱着饼干打瞌睡，也会为你醒来。",
    habitat: "饼干小屋",
    artMotion: "nod",
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
    foods: ["奶酪粒", "小米饼", "苹果片"],
    responses: ["豆丁抱着饼干点了点头。", "小耳朵抖了一下。", "醒来第一眼就看见你了。"],
  },
  {
    id: "bear-pie",
    name: "团团",
    species: "小棕熊",
    threshold: 38,
    couponOfferId: "merch",
    tagline: "围巾和小点心都准备好了，就差你。",
    habitat: "松果木屋",
    artMotion: "bob",
    palette: {
      primary: "#7b5748",
      secondary: "#d85c4f",
      accent: "#d9867b",
      inner: "#e9b3a7",
      eye: "#412d27",
    },
    model: {
      bodyScale: [1.08, 1.05, 0.9],
      headScale: [1.08, 1, 1],
      snoutScale: [0.68, 0.44, 0.5],
      earStyle: "round",
      tailStyle: "short",
      pattern: "none",
    },
    foods: ["蜂蜜面包", "蓝莓", "小饼干"],
    responses: ["团团把红围巾整理好了。", "小雪花落在它的鼻尖上。", "它把点心分给你一半。"],
  },
  {
    id: "mirror-rabbit",
    name: "雪球",
    species: "小白兔",
    threshold: 22,
    couponOfferId: "photo",
    tagline: "把最精神的一面留给你，也留给自己。",
    habitat: "晨光镜台",
    artMotion: "peek",
    palette: {
      primary: "#f6f0e5",
      secondary: "#f0c84f",
      accent: "#e5a6a0",
      inner: "#efb8b1",
      eye: "#4b3732",
    },
    model: {
      bodyScale: [0.92, 1.02, 0.86],
      headScale: [0.92, 0.9, 0.92],
      snoutScale: [0.56, 0.36, 0.42],
      earStyle: "long",
      tailStyle: "short",
      pattern: "none",
    },
    foods: ["胡萝卜片", "苜蓿草", "苹果枝"],
    responses: ["雪球举起小镜子照了照。", "长耳朵开心地竖了起来。", "它把最好看的角度留给你。"],
  },
  {
    id: "pig",
    name: "桃桃",
    species: "小猪",
    threshold: 28,
    couponOfferId: "drink",
    tagline: "小小一杯牛奶，也会喝得很认真。",
    habitat: "草莓暖房",
    artMotion: "sip",
    palette: {
      primary: "#eeaeb5",
      secondary: "#e88d9b",
      accent: "#dc7c86",
      inner: "#f1b9c0",
      eye: "#4f3833",
    },
    model: {
      bodyScale: [1.02, 0.98, 0.92],
      headScale: [0.98, 0.92, 0.94],
      snoutScale: [0.64, 0.42, 0.48],
      earStyle: "floppy",
      tailStyle: "short",
      pattern: "none",
    },
    foods: ["苹果块", "南瓜泥", "小米饼"],
    responses: ["桃桃把牛奶杯举高了一点。", "粉色蝴蝶结晃了晃。", "它认真喝完了最后一口。"],
  },
  {
    id: "book-dog",
    name: "阿卷",
    species: "小狗",
    threshold: 42,
    couponOfferId: "experience",
    tagline: "戴好眼镜，翻到写着你的那一页。",
    habitat: "书页花园",
    artMotion: "nod",
    palette: {
      primary: "#e7c39a",
      secondary: "#8bb39b",
      accent: "#d8847b",
      inner: "#e7aaa1",
      eye: "#4c3932",
    },
    model: {
      bodyScale: [1.02, 0.98, 0.88],
      headScale: [1.04, 0.88, 0.96],
      snoutScale: [0.64, 0.4, 0.48],
      earStyle: "floppy",
      tailStyle: "short",
      pattern: "none",
    },
    foods: ["鸡肉干", "红薯块", "小饼干"],
    responses: ["阿卷把书翻到了下一页。", "圆眼镜微微反光。", "它把今天的故事讲给你听。"],
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
