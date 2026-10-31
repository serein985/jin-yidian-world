import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { WorldStorageLike } from "../lib/world-storage";
import { useWorld } from "./useWorld";

function WorldHarness({ storage }: { storage?: WorldStorageLike }) {
  const world = useWorld({ storage });
  const active = world.state.activeAnimalId;

  return (
    <div>
      <output aria-label="animal count">{world.state.animals.length}</output>
      <output aria-label="nickname">{world.state.identity?.nickname ?? "none"}</output>
      <output aria-label="storage warning">{String(world.storageWarning)}</output>
      <output aria-label="active value">
        {active ? world.state.progress[active]?.feedingValue ?? -1 : -1}
      </output>
      <button type="button" onClick={() => world.addPreset("panda")}>
        add panda
      </button>
      <button
        type="button"
        onClick={() =>
          world.login({ nickname: "小满", avatar: "moss" }, "keeper")
        }
      >
        login
      </button>
      <button type="button" onClick={() => active && world.pet(active)}>
        pet
      </button>
      <button type="button" onClick={() => world.move("preset-tiger", "up")}>
        move tiger
      </button>
    </div>
  );
}

function storage(): WorldStorageLike & { values: Map<string, string> } {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

describe("useWorld", () => {
  it("loads default animals and persists collection changes", async () => {
    const store = storage();
    render(<WorldHarness storage={store} />);

    fireEvent.click(screen.getByRole("button", { name: "add panda" }));
    expect(screen.getByLabelText("animal count")).toHaveTextContent("4");
    await waitFor(() => expect(store.values.size).toBeGreaterThan(0));
  });

  it("stores a local identity and rewards the active animal", () => {
    render(<WorldHarness storage={storage()} />);
    fireEvent.click(screen.getByRole("button", { name: "login" }));
    fireEvent.click(screen.getByRole("button", { name: "pet" }));

    expect(screen.getByLabelText("nickname")).toHaveTextContent("小满");
    expect(screen.getByLabelText("active value")).toHaveTextContent("1");
  });

  it("warns when persistence is blocked", async () => {
    const store: WorldStorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException("Blocked", "SecurityError");
      },
    };
    render(<WorldHarness storage={store} />);

    await waitFor(() =>
      expect(screen.getByLabelText("storage warning")).toHaveTextContent("true"),
    );
  });
});
