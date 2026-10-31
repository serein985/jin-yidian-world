import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { createArtworkStore } from "./lib/artwork-store";
import { useArtworkUrls } from "./hooks/useArtworkUrls";
import { useWorld } from "./hooks/useWorld";
import { PRESET_ANIMALS_BY_ID, PRESET_ANIMAL_IDS } from "./domain/preset-animals";
import type {
  CustomAnimalInput,
  LocalIdentity,
  LoginStyle,
} from "./domain/world";
import { buildAnimalUrl, parseAnimalFromUrl } from "./lib/qr-route";
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { AnimalDetailScreen } from "./screens/AnimalDetailScreen";

const CreatorScreen = lazy(() =>
  import("./screens/CreatorScreen").then((module) => ({
    default: module.CreatorScreen,
  })),
);
const CalendarScreen = lazy(() =>
  import("./screens/CalendarScreen").then((module) => ({
    default: module.CalendarScreen,
  })),
);
const CouponScreen = lazy(() =>
  import("./screens/CouponScreen").then((module) => ({
    default: module.CouponScreen,
  })),
);
const ProfileScreen = lazy(() =>
  import("./screens/ProfileScreen").then((module) => ({
    default: module.ProfileScreen,
  })),
);
const ScannerScreen = lazy(() =>
  import("./screens/ScannerScreen").then((module) => ({
    default: module.ScannerScreen,
  })),
);

interface AppProps {
  search?: string;
}

type Screen =
  | "home"
  | "detail"
  | "creator"
  | "calendar"
  | "coupons"
  | "profile"
  | "scanner";

const viewScreens: Record<string, Screen> = {
  calendar: "calendar",
  coupons: "coupons",
  profile: "profile",
  scanner: "scanner",
};

export default function App({ search = window.location.search }: AppProps) {
  const world = useWorld({});
  const artworkStore = useMemo(() => createArtworkStore(), []);
  const { urls: artworkUrls, missingIds } = useArtworkUrls(
    world.state.animals,
    artworkStore,
  );
  const [screen, setScreen] = useState<Screen>("home");
  const [pendingAnimalId, setPendingAnimalId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [nowTick, setNowTick] = useState(0);
  const handledInitialRoute = useRef(false);
  const toastTimer = useRef<number | null>(null);
  const pendingLoginRoute = useRef<{
    animalId: string | null;
    source: "park" | "internal" | "invalid";
  } | null>(null);

  const knownIds = useMemo(
    () => [
      ...PRESET_ANIMAL_IDS.map((id) => `preset-${id}`),
      ...world.state.animals
        .filter((animal) => animal.kind === "custom")
        .map((animal) => animal.id),
    ],
    [world.state.animals],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNowTick((value) => value + 1), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (handledInitialRoute.current) return;
    handledInitialRoute.current = true;
    const route = parseAnimalFromUrl(search, knownIds);
    pendingLoginRoute.current = route;
    if (route.animalId && route.source !== "invalid" && !world.state.identity) {
      setPendingAnimalId(route.animalId);
    } else if (route.animalId && route.source !== "invalid") {
      openAnimal(route.animalId, true);
    } else if (route.source === "invalid") {
      showToast("没有找到这个园区伙伴", "error");
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (!window.location.search) {
        setScreen("home");
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const animalId = params.get("animal");
      if (animalId && knownIds.includes(animalId)) {
        world.select(animalId);
        setScreen("detail");
        return;
      }
      const view = params.get("view");
      setScreen(view ? viewScreens[view] ?? "home" : "home");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [knownIds, world]);

  useEffect(
    () => () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  function showToast(
    message: string,
    tone: "success" | "error" = "success",
  ) {
    setToast(`${tone}:${message}`);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2800);
  }

  function navigate(next: Screen) {
    setScreen(next);
    const url = new URL(window.location.href);
    url.search = "";
    if (next === "home") {
      url.searchParams.set("visit", "habitat");
    } else {
      url.searchParams.set("view", next);
    }
    window.history.pushState({}, "", url);
  }

  function openAnimal(animalId: string, recordScan = false) {
    const next = recordScan
      ? world.recordScan(animalId)
      : world.state;
    if (!next.animals.some((animal) => animal.id === animalId)) {
      showToast("没有找到这个园区伙伴", "error");
      return;
    }
    world.select(animalId);
    setScreen("detail");
    window.history.pushState({}, "", buildAnimalUrl(animalId));
  }

  function login(identity: LocalIdentity, style: LoginStyle) {
    world.login(identity, style);
    const pending =
      pendingAnimalId ??
      (pendingLoginRoute.current?.source !== "invalid"
        ? pendingLoginRoute.current?.animalId ?? null
        : null);
    if (pending) {
      openAnimal(pending, true);
      setPendingAnimalId(null);
    } else {
      if (pendingLoginRoute.current?.source === "invalid") {
        showToast("二维码中的动物不存在", "error");
      }
      setScreen("home");
    }
  }

  async function saveCustomAnimal(input: CustomAnimalInput, blob: Blob) {
    const assetId = input.artworkAssetId;
    await artworkStore.save(assetId, blob);
    const next = world.addCustom(input);
    const created = next.animals.find((animal) => animal.id === input.id);
    if (!created) {
      throw new Error("动物保存失败");
    }
    world.select(created.id);
    setScreen("detail");
    window.history.pushState({}, "", buildAnimalUrl(created.id));
    showToast(`${created.name}已经住进你的动物世界`);
  }

  async function deleteAnimal(animalId: string) {
    const animal = world.state.animals.find((candidate) => candidate.id === animalId);
    world.remove(animalId);
    if (animal?.kind === "custom") {
      try {
        await artworkStore.delete(animal.id);
      } catch {
        // A missing artwork entry should not prevent collection cleanup.
      }
    }
  }

  async function resetWorld() {
    const customIds = world.state.animals
      .filter((animal) => animal.kind === "custom")
      .map((animal) => animal.id);
    await Promise.all(customIds.map((id) => artworkStore.delete(id).catch(() => undefined)));
    world.reset();
    setScreen("home");
    window.history.pushState({}, "", `${window.location.pathname}?visit=habitat`);
  }

  if (!world.state.identity) {
    const pendingPreset = pendingAnimalId
      ? PRESET_ANIMALS_BY_ID[
          pendingAnimalId.replace("preset-", "") as keyof typeof PRESET_ANIMALS_BY_ID
        ]
      : null;
    return (
      <>
        <LoginScreen
          initialStyle={world.state.loginStyle}
          pendingAnimalName={pendingPreset?.name}
          onEnter={login}
        />
        <Toast value={toast} />
        {world.storageWarning && (
          <p className="storage-warning" role="status">
            本机记录暂不可用，本次体验仅在当前页面有效。
          </p>
        )}
      </>
    );
  }

  const activeAnimal =
    world.state.animals.find(
      (animal) => animal.id === world.state.activeAnimalId,
    ) ?? world.state.animals[0] ?? null;
  const sharedNav = {
    onOpenCalendar: () => navigate("calendar"),
    onOpenScanner: () => navigate("scanner"),
    onOpenCoupons: () => navigate("coupons"),
    onOpenProfile: () => navigate("profile"),
  };

  return (
    <>
      <Suspense fallback={<ScreenLoading />}>
      {screen === "home" && (
        <HomeScreen
          state={world.state}
          activeAnimal={activeAnimal}
          artworkUrls={artworkUrls}
          onAddPreset={(presetId) => {
            world.addPreset(presetId);
            showToast(`${PRESET_ANIMALS_BY_ID[presetId].name}已经加入收藏`);
          }}
          onOpenCreator={() => navigate("creator")}
          onSelectAnimal={(id) => world.select(id)}
          onMoveAnimal={(id, direction) => world.move(id, direction)}
          onDeleteAnimal={(id) => void deleteAnimal(id)}
          onEnterAnimal={(animalId) => openAnimal(animalId)}
          onPet={(id) => world.pet(id)}
          {...sharedNav}
        />
      )}
      {screen === "detail" && activeAnimal && (
        <AnimalDetailScreen
          state={world.state}
          animal={activeAnimal}
          artworkUrl={artworkUrls[activeAnimal.id] ?? null}
          onBack={() => {
            setScreen("home");
            window.history.pushState({}, "", `${window.location.pathname}?visit=habitat`);
          }}
          onPet={(id) => world.pet(id)}
          onFeed={(id, foodId) => world.feed(id, foodId).accepted}
          {...sharedNav}
        />
      )}
      {screen === "creator" && (
        <CreatorScreen
          onBack={() => setScreen("home")}
          onSave={saveCustomAnimal}
        />
      )}
      {screen === "calendar" && (
        <CalendarScreen
          key={nowTick}
          state={world.state}
          onBack={() => setScreen("home")}
          onAddAppointment={world.addAppointment}
          onToggleAppointment={world.toggleAppointment}
          onRemoveAppointment={world.removeAppointment}
          onOpenCoupons={sharedNav.onOpenCoupons}
          onOpenScanner={sharedNav.onOpenScanner}
          onOpenProfile={sharedNav.onOpenProfile}
        />
      )}
      {screen === "coupons" && (
        <CouponScreen
          state={world.state}
          onBack={() => setScreen("home")}
          onRedeem={(id) => {
            const accepted = world.redeem(id).accepted;
            if (accepted) showToast("优惠券已完成核销");
            return accepted;
          }}
          onOpenCalendar={sharedNav.onOpenCalendar}
          onOpenScanner={sharedNav.onOpenScanner}
          onOpenProfile={sharedNav.onOpenProfile}
        />
      )}
      {screen === "profile" && (
        <ProfileScreen
          state={world.state}
          onBack={() => setScreen("home")}
          onSave={(identity, style) => {
            world.login(identity, style);
            showToast("身份资料已保存");
          }}
          onReset={() => void resetWorld()}
          onOpenCalendar={sharedNav.onOpenCalendar}
          onOpenScanner={sharedNav.onOpenScanner}
          onOpenCoupons={sharedNav.onOpenCoupons}
        />
      )}
      {screen === "scanner" && (
        <ScannerScreen
          state={world.state}
          onBack={() => setScreen("home")}
          onDetected={(animalId) => openAnimal(animalId, true)}
        />
      )}
      </Suspense>
      <Toast value={toast} />
      {world.storageWarning && (
        <p className="storage-warning" role="status">
          本机记录暂不可用，本次体验仅在当前页面有效。
        </p>
      )}
      {missingIds.length > 0 && activeAnimal && missingIds.includes(activeAnimal.id) && (
        <Toast value="error:原创画作未能加载，可以重新上传" />
      )}
    </>
  );
}

function ScreenLoading() {
  return (
    <main className="world-screen screen-loading">
      <span className="screen-loading__halo" aria-hidden="true" />
      <p>正在打开这一页</p>
    </main>
  );
}

function Toast({ value }: { value: string }) {
  if (!value) return null;
  const [tone, message] = value.split(":");
  return (
    <div
      className={`app-toast app-toast--${tone}`}
      role="status"
      aria-live="polite"
    >
      {tone === "error" ? (
        <CircleAlert size={17} aria-hidden="true" />
      ) : (
        <CheckCircle2 size={17} aria-hidden="true" />
      )}
      {message}
    </div>
  );
}
