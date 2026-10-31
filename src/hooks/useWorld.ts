import { useCallback, useEffect, useRef, useState } from "react";
import type { PresetAnimalId } from "../domain/preset-animals";
import {
  addAppointment,
  addCustomAnimal,
  addPresetAnimal,
  createWorldState,
  feedAnimal,
  moveAnimal,
  petAnimal,
  recordParkScan,
  redeemCoupon,
  removeAnimal,
  removeAppointment,
  setActiveAnimal,
  setIdentity,
  toggleAppointmentComplete,
  type AppointmentInput,
  type CustomAnimalInput,
  type LocalIdentity,
  type LoginStyle,
  type WorldState,
} from "../domain/world";
import {
  loadWorld,
  saveWorld,
  type WorldStorageLike,
} from "../lib/world-storage";

function getBrowserStorage(): WorldStorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function useWorld({ storage }: { storage?: WorldStorageLike }) {
  const [initial] = useState(() => {
    const activeStorage = storage ?? getBrowserStorage();
    return {
      storage: activeStorage,
      state: activeStorage
        ? loadWorld(activeStorage, new Date()).state
        : createWorldState(new Date()),
      missingStorage: !activeStorage,
    };
  });
  const [state, setState] = useState<WorldState>(initial.state);
  const [storageWarning, setStorageWarning] = useState(initial.missingStorage);
  const stateRef = useRef(initial.state);

  const commit = useCallback((next: WorldState) => {
    stateRef.current = next;
    setState(next);
    return next;
  }, []);

  useEffect(() => {
    if (!initial.storage) return;
    setStorageWarning(!saveWorld(initial.storage, state));
  }, [initial.storage, state]);

  const activeAnimal = state.animals.find(
    (animal) => animal.id === state.activeAnimalId,
  ) ?? null;

  return {
    state,
    activeAnimal,
    storageWarning,
    addPreset: (presetId: PresetAnimalId) =>
      commit(addPresetAnimal(stateRef.current, presetId, new Date())),
    addCustom: (input: CustomAnimalInput) =>
      commit(addCustomAnimal(stateRef.current, input, new Date())),
    remove: (animalId: string) =>
      commit(removeAnimal(stateRef.current, animalId)),
    move: (animalId: string, direction: "up" | "down") =>
      commit(moveAnimal(stateRef.current, animalId, direction)),
    select: (animalId: string) =>
      commit(setActiveAnimal(stateRef.current, animalId)),
    login: (identity: LocalIdentity, loginStyle: LoginStyle) =>
      commit(setIdentity(stateRef.current, identity, loginStyle)),
    pet: (animalId: string) => {
      const result = petAnimal(stateRef.current, animalId, new Date());
      commit(result.state);
      return result;
    },
    feed: (animalId: string, foodId: string) => {
      const result = feedAnimal(stateRef.current, animalId, foodId, new Date());
      if (result.accepted) commit(result.state);
      return result;
    },
    redeem: (animalId: string) => {
      const result = redeemCoupon(stateRef.current, animalId, new Date());
      if (result.accepted) commit(result.state);
      return result;
    },
    addAppointment: (input: AppointmentInput) =>
      commit(addAppointment(stateRef.current, input, new Date())),
    toggleAppointment: (appointmentId: string) =>
      commit(toggleAppointmentComplete(stateRef.current, appointmentId, new Date())),
    removeAppointment: (appointmentId: string) =>
      commit(removeAppointment(stateRef.current, appointmentId)),
    recordScan: (animalId: string) =>
      commit(recordParkScan(stateRef.current, animalId, new Date())),
    reset: () => commit(createWorldState(new Date())),
  };
}
