import { describe, expect, it } from "vitest";
import {
  addAppointment,
  addCustomAnimal,
  addPresetAnimal,
  createWorldState,
  feedAnimal,
  isAppointmentDue,
  moveAnimal,
  petAnimal,
  recordParkScan,
  redeemCoupon,
  removeAnimal,
  setIdentity,
  toggleAppointmentComplete,
} from "./world";
import { PRESET_ANIMALS, PRESET_ANIMALS_BY_ID } from "./preset-animals";

const morning = new Date(2026, 9, 31, 9, 0, 0);
const evening = new Date(2026, 9, 31, 18, 0, 0);
const tomorrow = new Date(2026, 10, 1, 9, 0, 0);

describe("preset animals", () => {
  it("defines all twelve presets with unique ids and varied thresholds", () => {
    expect(PRESET_ANIMALS).toHaveLength(12);
    expect(new Set(PRESET_ANIMALS.map((animal) => animal.id)).size).toBe(12);
    expect(PRESET_ANIMALS.map((animal) => animal.threshold)).toEqual([
      35, 30, 50, 40, 25, 20, 45, 30, 38, 22, 28, 42,
    ]);
    expect(PRESET_ANIMALS_BY_ID.panda.name).toBe("糯糯");
  });
});

describe("world collection", () => {
  it("starts with identity null and the three default animals", () => {
    const state = createWorldState(morning);

    expect(state.identity).toBeNull();
    expect(state.animals.map((animal) => animal.presetId)).toEqual([
      "red-panda",
      "tiger",
      "sheep",
    ]);
    expect(Object.keys(state.progress)).toHaveLength(3);
  });

  it("adds a new preset once and ignores duplicates", () => {
    const first = addPresetAnimal(createWorldState(morning), "panda", morning);
    const second = addPresetAnimal(first, "panda", morning);

    expect(first.animals).toHaveLength(4);
    expect(first.animals.at(-1)?.presetId).toBe("panda");
    expect(second.animals).toHaveLength(4);
  });

  it("adds and removes a custom animal with dependent data", () => {
    const custom = addCustomAnimal(
      createWorldState(morning),
      {
        name: "小云",
        species: "云朵兽",
        theme: "rose",
        couponOfferId: "photo",
        threshold: 25,
        touchpoints: [
          { id: "tp-1", x: 0.5, y: 0.4, effect: "hearts", label: "摸摸" },
        ],
        artworkAssetId: "asset-1",
      },
      morning,
    );
    const created = custom.animals.at(-1)!;
    const withAppointment = addAppointment(
      custom,
      {
        animalId: created.id,
        type: "appointment",
        title: "来看小云",
        date: "2026-11-01",
        time: "10:00",
        note: "",
      },
      morning,
    );
    const removed = removeAnimal(withAppointment, created.id);

    expect(custom.animals).toHaveLength(4);
    expect(custom.progress[created.id].feedingValue).toBe(0);
    expect(removed.animals).toHaveLength(3);
    expect(removed.progress[created.id]).toBeUndefined();
    expect(removed.appointments).toHaveLength(0);
  });

  it("moves animals up and down in collection order", () => {
    const moved = moveAnimal(createWorldState(morning), "preset-tiger", "up");

    expect(moved.animals.map((animal) => animal.id).slice(0, 2)).toEqual([
      "preset-tiger",
      "preset-red-panda",
    ]);
  });

  it("stores the local identity and selected login style", () => {
    const state = setIdentity(
      createWorldState(morning),
      { nickname: "小满", avatar: "moss" },
      "keeper",
    );

    expect(state.identity?.nickname).toBe("小满");
    expect(state.loginStyle).toBe("keeper");
  });
});

describe("animal progress and coupons", () => {
  it("keeps pet and feed rewards independent per animal and day", () => {
    let state = createWorldState(morning);
    state = petAnimal(state, "preset-red-panda", morning).state;
    state = petAnimal(state, "preset-red-panda", evening).state;
    state = feedAnimal(state, "preset-red-panda", "bamboo", morning).state;
    state = feedAnimal(state, "preset-red-panda", "bamboo", evening).state;
    state = petAnimal(state, "preset-tiger", evening).state;

    expect(state.progress["preset-red-panda"].feedingValue).toBe(5);
    expect(state.progress["preset-tiger"].feedingValue).toBe(1);
    expect(state.journal.filter((event) => event.type === "touch")).toHaveLength(2);
    expect(state.journal.filter((event) => event.type === "feed")).toHaveLength(1);
  });

  it("reopens rewards on a new local day", () => {
    const first = petAnimal(createWorldState(morning), "preset-sheep", morning);
    const second = feedAnimal(first.state, "preset-sheep", "hay", tomorrow);

    expect(second.accepted).toBe(true);
    expect(second.state.progress["preset-sheep"].feedingValue).toBe(5);
  });

  it("unlocks each animal coupon at its own threshold", () => {
    let state = addPresetAnimal(createWorldState(morning), "rabbit", morning);
    for (let day = 0; day < 4; day += 1) {
      const date = new Date(2026, 9, 31 + day, 9);
      state = petAnimal(state, "preset-rabbit", date).state;
      state = feedAnimal(state, "preset-rabbit", "carrot", date).state;
    }

    expect(state.progress["preset-rabbit"].feedingValue).toBe(20);
    expect(state.progress["preset-rabbit"].coupon?.status).toBe("available");
    expect(state.progress["preset-tiger"].coupon).toBeNull();
  });

  it("redeems a coupon once", () => {
    let state = addPresetAnimal(createWorldState(morning), "rabbit", morning);
    for (let day = 0; day < 4; day += 1) {
      const date = new Date(2026, 9, 31 + day, 9);
      state = petAnimal(state, "preset-rabbit", date).state;
      state = feedAnimal(state, "preset-rabbit", "carrot", date).state;
    }
    const first = redeemCoupon(state, "preset-rabbit", tomorrow);
    const second = redeemCoupon(first.state, "preset-rabbit", tomorrow);

    expect(first.accepted).toBe(true);
    expect(first.state.progress["preset-rabbit"].coupon?.status).toBe("redeemed");
    expect(second.accepted).toBe(false);
  });

  it("records a park scan against the requested animal", () => {
    const state = recordParkScan(createWorldState(morning), "preset-fox", morning);
    expect(state.journal[0].type).toBe("park-scan");
    expect(state.journal[0].animalId).toBe("preset-fox");
  });
});

describe("calendar appointments", () => {
  it("adds, sorts and completes a page-local reminder", () => {
    let state = addAppointment(
      createWorldState(morning),
      {
        animalId: "preset-tiger",
        type: "reminder",
        title: "去看阿呜",
        date: "2026-10-31",
        time: "08:00",
        note: "带上互动记录",
      },
      morning,
    );
    expect(isAppointmentDue(state.appointments[0], morning)).toBe(true);

    state = toggleAppointmentComplete(state, state.appointments[0].id, evening);
    expect(state.appointments[0].completedAt).not.toBeNull();
    expect(isAppointmentDue(state.appointments[0], evening)).toBe(false);
  });
});
