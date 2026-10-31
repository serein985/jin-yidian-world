import {
  COUPONS_BY_ID,
  getCouponOffer,
  type CouponOfferId,
} from "./coupons";
import {
  DEFAULT_PRESET_IDS,
  PRESET_ANIMAL_IDS,
  PRESET_ANIMALS_BY_ID,
  type PresetAnimalId,
  type TouchEffect,
} from "./preset-animals";

export type LoginStyle = "ticket" | "keeper" | "minimal";

export interface Touchpoint {
  id: string;
  x: number;
  y: number;
  effect: TouchEffect;
  label: string;
}

export interface AnimalProfile {
  id: string;
  kind: "preset" | "custom";
  presetId: PresetAnimalId | null;
  name: string;
  species: string;
  theme: string;
  couponOfferId: CouponOfferId;
  threshold: number;
  touchpoints: Touchpoint[];
  createdAt: string;
  artworkAssetId: string | null;
}

export interface CouponRecord {
  id: string;
  animalId: string;
  code: string;
  title: string;
  offerId: CouponOfferId;
  status: "available" | "redeemed";
  unlockedAt: string;
  redeemedAt: string | null;
}

export interface AnimalProgress {
  animalId: string;
  feedingValue: number;
  totalTouches: number;
  totalFeeds: number;
  lastPetRewardDate: string | null;
  lastFeedDate: string | null;
  lastFeedId: string | null;
  coupon: CouponRecord | null;
}

export interface LocalIdentity {
  nickname: string;
  avatar: string;
}

export type JournalType =
  | "touch"
  | "feed"
  | "coupon-unlock"
  | "coupon-redeem"
  | "park-scan";

export interface JournalEvent {
  id: string;
  animalId: string | null;
  type: JournalType;
  date: string;
  time: string;
  title: string;
  detail: string;
}

export interface Appointment {
  id: string;
  animalId: string;
  type: "appointment" | "reminder";
  title: string;
  date: string;
  time: string | null;
  note: string;
  completedAt: string | null;
}

export interface WorldState {
  version: 3;
  identity: LocalIdentity | null;
  loginStyle: LoginStyle;
  animals: AnimalProfile[];
  progress: Record<string, AnimalProgress>;
  journal: JournalEvent[];
  appointments: Appointment[];
  activeAnimalId: string | null;
}

export interface CustomAnimalInput {
  id?: string;
  name: string;
  species: string;
  theme: string;
  couponOfferId: CouponOfferId;
  threshold: number;
  touchpoints: Touchpoint[];
  artworkAssetId: string;
}

export interface AppointmentInput {
  animalId: string;
  type: "appointment" | "reminder";
  title: string;
  date: string;
  time: string | null;
  note: string;
}

const loginStyles: LoginStyle[] = ["ticket", "keeper", "minimal"];
const touchEffects: TouchEffect[] = [
  "bounce",
  "shake",
  "sparkle",
  "hearts",
  "short-clip",
];
const couponOfferIds = Object.keys(COUPONS_BY_ID) as CouponOfferId[];

function randomId(prefix: string): string {
  const bytes = new Uint8Array(6);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  return `${prefix}-${Array.from(bytes, (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("")}`;
}

function couponCode(animal: AnimalProfile): string {
  const prefix =
    animal.kind === "preset"
      ? (animal.presetId ?? "ZOO").slice(0, 2).toUpperCase()
      : "CU";
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return `${prefix}-${Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("")}`;
}

export function localDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function localTimeKey(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

function presetProfile(presetId: PresetAnimalId, now: Date): AnimalProfile {
  const preset = PRESET_ANIMALS_BY_ID[presetId];
  return {
    id: `preset-${presetId}`,
    kind: "preset",
    presetId,
    name: preset.name,
    species: preset.species,
    theme: presetId,
    couponOfferId: preset.couponOfferId,
    threshold: preset.threshold,
    touchpoints: [],
    createdAt: now.toISOString(),
    artworkAssetId: null,
  };
}

export function createProgress(animalId: string): AnimalProgress {
  return {
    animalId,
    feedingValue: 0,
    totalTouches: 0,
    totalFeeds: 0,
    lastPetRewardDate: null,
    lastFeedDate: null,
    lastFeedId: null,
    coupon: null,
  };
}

export function createWorldState(now: Date): WorldState {
  const animals = DEFAULT_PRESET_IDS.map((presetId) =>
    presetProfile(presetId, now),
  );
  return {
    version: 3,
    identity: null,
    loginStyle: "ticket",
    animals,
    progress: Object.fromEntries(
      animals.map((animal) => [animal.id, createProgress(animal.id)]),
    ),
    journal: [],
    appointments: [],
    activeAnimalId: animals[0]?.id ?? null,
  };
}

export function addPresetAnimal(
  state: WorldState,
  presetId: PresetAnimalId,
  now: Date,
): WorldState {
  if (state.animals.some((animal) => animal.presetId === presetId)) {
    return state;
  }
  const animal = presetProfile(presetId, now);
  return {
    ...state,
    animals: [...state.animals, animal],
    progress: { ...state.progress, [animal.id]: createProgress(animal.id) },
    activeAnimalId: state.activeAnimalId ?? animal.id,
  };
}

export function addCustomAnimal(
  state: WorldState,
  input: CustomAnimalInput,
  now: Date,
): WorldState {
  const id =
    input.id?.startsWith("custom-") ? input.id : randomId("custom");
  const animal: AnimalProfile = {
    id,
    kind: "custom",
    presetId: null,
    name: input.name.trim().slice(0, 12),
    species: input.species.trim().slice(0, 12),
    theme: input.theme,
    couponOfferId: input.couponOfferId,
    threshold: Math.min(100, Math.max(20, Math.round(input.threshold / 5) * 5)),
    touchpoints: input.touchpoints.slice(0, 12).map((touchpoint) => ({
      ...touchpoint,
      x: Math.min(0.96, Math.max(0.04, touchpoint.x)),
      y: Math.min(0.96, Math.max(0.04, touchpoint.y)),
      label: touchpoint.label.slice(0, 6),
    })),
    createdAt: now.toISOString(),
    artworkAssetId: input.artworkAssetId,
  };
  return {
    ...state,
    animals: [...state.animals, animal],
    progress: { ...state.progress, [id]: createProgress(id) },
    activeAnimalId: animal.id,
  };
}

export function removeAnimal(state: WorldState, animalId: string): WorldState {
  const animals = state.animals.filter((animal) => animal.id !== animalId);
  const progress = { ...state.progress };
  delete progress[animalId];
  return {
    ...state,
    animals,
    progress,
    journal: state.journal.filter((event) => event.animalId !== animalId),
    appointments: state.appointments.filter(
      (appointment) => appointment.animalId !== animalId,
    ),
    activeAnimalId:
      state.activeAnimalId === animalId
        ? animals[0]?.id ?? null
        : state.activeAnimalId,
  };
}

export function moveAnimal(
  state: WorldState,
  animalId: string,
  direction: "up" | "down",
): WorldState {
  const index = state.animals.findIndex((animal) => animal.id === animalId);
  if (index < 0) {
    return state;
  }
  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= state.animals.length) {
    return state;
  }
  const animals = [...state.animals];
  [animals[index], animals[nextIndex]] = [animals[nextIndex], animals[index]];
  return { ...state, animals };
}

export function setActiveAnimal(
  state: WorldState,
  animalId: string,
): WorldState {
  return state.animals.some((animal) => animal.id === animalId)
    ? { ...state, activeAnimalId: animalId }
    : state;
}

export function setIdentity(
  state: WorldState,
  identity: LocalIdentity,
  loginStyle: LoginStyle,
): WorldState {
  return {
    ...state,
    identity: {
      nickname: identity.nickname.trim().slice(0, 12),
      avatar: identity.avatar,
    },
    loginStyle,
  };
}

function journalEvent(
  animal: AnimalProfile,
  type: JournalType,
  date: Date,
  title: string,
  detail: string,
): JournalEvent {
  return {
    id: randomId("event"),
    animalId: animal.id,
    type,
    date: localDateKey(date),
    time: localTimeKey(date),
    title,
    detail,
  };
}

function appendJournal(state: WorldState, events: JournalEvent[]): JournalEvent[] {
  return [...events, ...state.journal].slice(0, 500);
}

function couponFor(
  animal: AnimalProfile,
  now: Date,
): CouponRecord {
  const offer = getCouponOffer(animal.couponOfferId);
  return {
    id: randomId("coupon"),
    animalId: animal.id,
    code: couponCode(animal),
    title: offer.title,
    offerId: offer.id,
    status: "available",
    unlockedAt: now.toISOString(),
    redeemedAt: null,
  };
}

function interactWithAnimal(
  state: WorldState,
  animalId: string,
  now: Date,
  kind: "touch" | "feed",
  foodId?: string,
): {
  state: WorldState;
  rewarded: boolean;
  accepted: boolean;
  unlockedCoupon: CouponRecord | null;
} {
  const animal = state.animals.find((candidate) => candidate.id === animalId);
  const progress = state.progress[animalId];
  if (!animal || !progress) {
    return { state, rewarded: false, accepted: false, unlockedCoupon: null };
  }

  const today = localDateKey(now);
  if (kind === "feed" && progress.lastFeedDate === today) {
    return { state, rewarded: false, accepted: false, unlockedCoupon: null };
  }
  const rewardEligible =
    kind === "feed" ? progress.lastFeedDate !== today : progress.lastPetRewardDate !== today;
  const valueGain = rewardEligible ? (kind === "feed" ? 4 : 1) : 0;
  const nextProgress: AnimalProgress = {
    ...progress,
    feedingValue: progress.feedingValue + valueGain,
    totalTouches: progress.totalTouches + (kind === "touch" ? 1 : 0),
    totalFeeds: progress.totalFeeds + (kind === "feed" ? 1 : 0),
    lastPetRewardDate:
      kind === "touch" && rewardEligible ? today : progress.lastPetRewardDate,
    lastFeedDate:
      kind === "feed" && rewardEligible ? today : progress.lastFeedDate,
    lastFeedId:
      kind === "feed" && rewardEligible ? foodId ?? null : progress.lastFeedId,
  };

  let unlockedCoupon: CouponRecord | null = null;
  if (!nextProgress.coupon && nextProgress.feedingValue >= animal.threshold) {
    nextProgress.coupon = couponFor(animal, now);
    unlockedCoupon = nextProgress.coupon;
  }

  const events: JournalEvent[] = [];
  if (rewardEligible) {
    events.push(
      journalEvent(
        animal,
        kind,
        now,
        kind === "touch" ? `抚摸${animal.name}` : `投喂${animal.name}`,
        kind === "touch" ? "今日第一次靠近，喂养值 +1" : "完成今日投喂，喂养值 +4",
      ),
    );
  }
  if (unlockedCoupon) {
    events.push(
      journalEvent(
        animal,
        "coupon-unlock",
        now,
        "解锁优惠券",
        unlockedCoupon.title,
      ),
    );
  }

  return {
    state: {
      ...state,
      progress: { ...state.progress, [animalId]: nextProgress },
      journal: appendJournal(state, events),
    },
    rewarded: rewardEligible,
    accepted: kind === "feed" ? rewardEligible : true,
    unlockedCoupon,
  };
}

export function petAnimal(state: WorldState, animalId: string, now: Date) {
  return interactWithAnimal(state, animalId, now, "touch");
}

export function feedAnimal(
  state: WorldState,
  animalId: string,
  foodId: string,
  now: Date,
) {
  return interactWithAnimal(state, animalId, now, "feed", foodId);
}

export function redeemCoupon(
  state: WorldState,
  animalId: string,
  now: Date,
): { state: WorldState; accepted: boolean } {
  const progress = state.progress[animalId];
  const animal = state.animals.find((candidate) => candidate.id === animalId);
  if (!progress?.coupon || progress.coupon.status !== "available" || !animal) {
    return { state, accepted: false };
  }
  const coupon = {
    ...progress.coupon,
    status: "redeemed" as const,
    redeemedAt: now.toISOString(),
  };
  return {
    accepted: true,
    state: {
      ...state,
      progress: {
        ...state.progress,
        [animalId]: { ...progress, coupon },
      },
      journal: appendJournal(state, [
        journalEvent(
          animal,
          "coupon-redeem",
          now,
          "优惠券已核销",
          coupon.title,
        ),
      ]),
    },
  };
}

export function addAppointment(
  state: WorldState,
  input: AppointmentInput,
  now: Date,
): WorldState {
  if (!state.animals.some((animal) => animal.id === input.animalId)) {
    return state;
  }
  const appointment: Appointment = {
    id: randomId("appointment"),
    animalId: input.animalId,
    type: input.type,
    title: input.title.trim().slice(0, 30),
    date: input.date,
    time: input.time,
    note: input.note.trim().slice(0, 120),
    completedAt: null,
  };
  if (!appointment.title) {
    return state;
  }
  return {
    ...state,
    appointments: [...state.appointments, appointment].slice(-200),
  };
}

export function toggleAppointmentComplete(
  state: WorldState,
  appointmentId: string,
  now: Date,
): WorldState {
  return {
    ...state,
    appointments: state.appointments.map((appointment) =>
      appointment.id === appointmentId
        ? {
            ...appointment,
            completedAt: appointment.completedAt ? null : now.toISOString(),
          }
        : appointment,
    ),
  };
}

export function removeAppointment(
  state: WorldState,
  appointmentId: string,
): WorldState {
  return {
    ...state,
    appointments: state.appointments.filter(
      (appointment) => appointment.id !== appointmentId,
    ),
  };
}

export function isAppointmentDue(
  appointment: Appointment,
  now: Date,
): boolean {
  if (appointment.completedAt) {
    return false;
  }
  const dateTime = new Date(
    `${appointment.date}T${appointment.time ?? "23:59"}:00`,
  );
  return dateTime.getTime() < now.getTime();
}

export function recordParkScan(
  state: WorldState,
  animalId: string,
  now: Date,
): WorldState {
  let nextState = state;
  let animal = nextState.animals.find((candidate) => candidate.id === animalId);
  if (!animal && animalId.startsWith("preset-")) {
    const presetId = animalId.slice("preset-".length) as PresetAnimalId;
    if (PRESET_ANIMAL_IDS.includes(presetId)) {
      nextState = addPresetAnimal(nextState, presetId, now);
      animal = nextState.animals.find((candidate) => candidate.id === animalId);
    }
  }
  if (!animal) {
    return nextState;
  }
  return {
    ...nextState,
    activeAnimalId: animal.id,
    journal: appendJournal(nextState, [
      journalEvent(animal, "park-scan", now, "在园区遇见", animal.name),
    ]),
  };
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

function validDate(value: unknown): string | null {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : null;
}

export function sanitizeWorldState(value: unknown, now: Date): WorldState {
  const fallback = createWorldState(now);
  if (!value || typeof value !== "object") {
    return fallback;
  }
  const raw = value as Partial<WorldState>;
  const rawAnimals = Array.isArray(raw.animals) ? raw.animals : [];
  const animals: AnimalProfile[] = [];
  const seenPreset = new Set<PresetAnimalId>();

  for (const candidate of rawAnimals) {
    if (!candidate || typeof candidate !== "object") continue;
    const profile = candidate as AnimalProfile;
    const isPreset =
      profile.kind === "preset" &&
      PRESET_ANIMAL_IDS.includes(profile.presetId as PresetAnimalId);
    if (isPreset) {
      const presetId = profile.presetId as PresetAnimalId;
      if (seenPreset.has(presetId)) continue;
      seenPreset.add(presetId);
      animals.push(presetProfile(presetId, now));
      continue;
    }
    if (
      profile.kind !== "custom" ||
      typeof profile.id !== "string" ||
      !profile.id.startsWith("custom-") ||
      typeof profile.name !== "string" ||
      typeof profile.species !== "string"
    ) {
      continue;
    }
    animals.push({
      id: profile.id,
      kind: "custom",
      presetId: null,
      name: profile.name.slice(0, 12),
      species: profile.species.slice(0, 12),
      theme: typeof profile.theme === "string" ? profile.theme : "moss",
      couponOfferId: couponOfferIds.includes(profile.couponOfferId)
        ? profile.couponOfferId
        : "merch",
      threshold: Math.round(
        clampNumber(profile.threshold, 20, 100, 30) / 5,
      ) * 5,
      touchpoints: Array.isArray(profile.touchpoints)
        ? profile.touchpoints.slice(0, 12).filter(
            (point): point is Touchpoint =>
              Boolean(point) &&
              typeof point.id === "string" &&
              typeof point.x === "number" &&
              typeof point.y === "number" &&
              touchEffects.includes(point.effect),
          )
        : [],
      createdAt:
        typeof profile.createdAt === "string"
          ? profile.createdAt
          : now.toISOString(),
      artworkAssetId:
        typeof profile.artworkAssetId === "string"
          ? profile.artworkAssetId
          : null,
    });
  }

  const progress: Record<string, AnimalProgress> = {};
  for (const animal of animals) {
    const rawProgress = (raw.progress as Record<string, AnimalProgress> | undefined)?.[
      animal.id
    ];
    const coupon = rawProgress?.coupon;
    progress[animal.id] = {
      animalId: animal.id,
      feedingValue: Math.floor(
        clampNumber(rawProgress?.feedingValue, 0, 9999, 0),
      ),
      totalTouches: Math.floor(
        clampNumber(rawProgress?.totalTouches, 0, 999999, 0),
      ),
      totalFeeds: Math.floor(
        clampNumber(rawProgress?.totalFeeds, 0, 999999, 0),
      ),
      lastPetRewardDate: validDate(rawProgress?.lastPetRewardDate),
      lastFeedDate: validDate(rawProgress?.lastFeedDate),
      lastFeedId:
        typeof rawProgress?.lastFeedId === "string"
          ? rawProgress.lastFeedId
          : null,
      coupon:
        coupon &&
        (coupon.status === "available" || coupon.status === "redeemed") &&
        typeof coupon.code === "string"
          ? {
              ...coupon,
              animalId: animal.id,
              offerId: couponOfferIds.includes(coupon.offerId)
                ? coupon.offerId
                : animal.couponOfferId,
              status:
                coupon.status === "redeemed" && !coupon.redeemedAt
                  ? "available"
                  : coupon.status,
            }
          : null,
    };
  }

  const identity =
    raw.identity &&
    typeof raw.identity.nickname === "string" &&
    raw.identity.nickname.trim() &&
    typeof raw.identity.avatar === "string"
      ? {
          nickname: raw.identity.nickname.trim().slice(0, 12),
          avatar: raw.identity.avatar,
        }
      : null;
  const activeAnimalId = animals.some(
    (animal) => animal.id === raw.activeAnimalId,
  )
    ? raw.activeAnimalId!
    : animals[0]?.id ?? null;

  return {
    version: 3,
    identity,
    loginStyle: loginStyles.includes(raw.loginStyle as LoginStyle)
      ? (raw.loginStyle as LoginStyle)
      : "ticket",
    animals,
    progress,
    journal: Array.isArray(raw.journal) ? raw.journal.slice(0, 500) : [],
    appointments: Array.isArray(raw.appointments)
      ? raw.appointments
          .filter(
            (appointment) =>
              Boolean(appointment) &&
              animals.some((animal) => animal.id === appointment.animalId),
          )
          .slice(-200)
      : [],
    activeAnimalId,
  };
}
