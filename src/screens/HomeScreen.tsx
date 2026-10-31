import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { AnimalArtworkStage } from "../components/AnimalArtworkStage";
import { AnimalRail } from "../components/AnimalRail";
import { AppHeader } from "../components/AppHeader";
import { PaintedAnimal } from "../components/PaintedAnimal";
import { PresetLibrary } from "../components/PresetLibrary";
import { PRESET_ANIMALS_BY_ID, type PresetAnimalId } from "../domain/preset-animals";
import {
  isAppointmentDue,
  type AnimalProfile,
  type WorldState,
} from "../domain/world";

interface HomeScreenProps {
  state: WorldState;
  activeAnimal: AnimalProfile | null;
  artworkUrls: Record<string, string>;
  onAddPreset: (presetId: PresetAnimalId) => void;
  onOpenCreator: () => void;
  onSelectAnimal: (animalId: string) => void;
  onMoveAnimal: (animalId: string, direction: "up" | "down") => void;
  onDeleteAnimal: (animalId: string) => void;
  onEnterAnimal: (animalId: string) => void;
  onPet: (animalId: string) => void;
  onOpenCalendar: () => void;
  onOpenScanner: () => void;
  onOpenCoupons: () => void;
  onOpenProfile: () => void;
}

export function HomeScreen({
  state,
  activeAnimal,
  artworkUrls,
  onAddPreset,
  onOpenCreator,
  onSelectAnimal,
  onMoveAnimal,
  onDeleteAnimal,
  onEnterAnimal,
  onPet,
  onOpenCalendar,
  onOpenScanner,
  onOpenCoupons,
  onOpenProfile,
}: HomeScreenProps) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const preset = activeAnimal?.presetId
    ? PRESET_ANIMALS_BY_ID[activeAnimal.presetId]
    : null;
  const progress = activeAnimal ? state.progress[activeAnimal.id] : null;
  const remaining = activeAnimal && progress
    ? Math.max(0, activeAnimal.threshold - progress.feedingValue)
    : 0;
  const progressPercent =
    activeAnimal && progress
      ? Math.min(100, (progress.feedingValue / activeAnimal.threshold) * 100)
      : 0;
  const dueReminders = state.appointments.filter((appointment) =>
    isAppointmentDue(appointment, new Date()),
  );

  return (
    <main className="world-screen home-screen">
      <div className="world-atmosphere" aria-hidden="true">
        <span className="world-light" />
        <span className="world-mist" />
        <span className="world-grain" />
      </div>
      <AppHeader
        nickname={state.identity?.nickname}
        onOpenCalendar={onOpenCalendar}
        onOpenScanner={onOpenScanner}
        onOpenCoupons={onOpenCoupons}
        onOpenProfile={onOpenProfile}
      />

      {!activeAnimal ? (
        <section className="empty-world">
          <div className="empty-world__halo" aria-hidden="true">
            <span />
            <span />
          </div>
          <p className="eyebrow">YOUR WORLD IS OPEN</p>
          <h1>这里还留着一块<br />柔软的草地。</h1>
          <p>从预设动物中选择一位伙伴，或者上传自己的画，让它住进来。</p>
          <button
            className="primary-large-button"
            type="button"
            onClick={() => setLibraryOpen(true)}
          >
            <Plus size={18} aria-hidden="true" />
            添加第一只动物
          </button>
        </section>
      ) : (
        <>
          <section className="home-hero">
            <div className="home-hero__copy">
              <p className="eyebrow">{preset?.habitat ?? "原创伙伴空间"}</p>
              <h1>{activeAnimal.name}</h1>
              <p>{preset?.tagline ?? "从你的画里醒来，只愿意和你待一会儿。"}</p>
            </div>

            <div className={`home-hero__stage home-hero__stage--${activeAnimal.theme}`}>
              {preset ? (
                <button
                  type="button"
                  className="painted-stage-hit"
                  aria-label={`轻轻抚摸${activeAnimal.name}`}
                  onClick={() => onPet(activeAnimal.id)}
                >
                  <PaintedAnimal presetId={preset.id} />
                </button>
              ) : (
                <AnimalArtworkStage
                  artworkUrl={artworkUrls[activeAnimal.id] ?? null}
                  touchpoints={activeAnimal.touchpoints}
                  editing={false}
                  selectedTouchpointId={null}
                />
              )}
            </div>

            <div className="hero-status">
              <span className="hero-status__live">
                <i aria-hidden="true" />
                正在陪你
              </span>
              <span>{activeAnimal.species}</span>
            </div>
          </section>

          <section className="home-controls">
            <div className="home-progress">
              <div>
                <span>今日喂养值</span>
                <strong>
                  {progress?.feedingValue ?? 0}
                  <small> / {activeAnimal.threshold}</small>
                </strong>
              </div>
              <div className="home-progress__track">
                <span style={{ width: `${progressPercent}%` }} />
              </div>
              <p>
                {progress?.coupon
                  ? progress.coupon.status === "redeemed"
                    ? "专属优惠券已核销"
                    : "专属优惠券已解锁"
                  : `再陪伴 ${remaining} 点解锁专属优惠`}
              </p>
            </div>

            <AnimalRail
              animals={state.animals}
              activeAnimalId={activeAnimal.id}
              onSelect={onSelectAnimal}
            />

            <div className="collection-actions">
              <button
                type="button"
                aria-label={`上移${activeAnimal.name}`}
                onClick={() => onMoveAnimal(activeAnimal.id, "up")}
              >
                <ArrowUp size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={`下移${activeAnimal.name}`}
                onClick={() => onMoveAnimal(activeAnimal.id, "down")}
              >
                <ArrowDown size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={`删除${activeAnimal.name}`}
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="add-animal-button"
                onClick={() => setLibraryOpen(true)}
              >
                <Plus size={16} aria-hidden="true" />
                添加动物
              </button>
            </div>

            {dueReminders.length > 0 && (
              <button
                type="button"
                className="reminder-banner"
                onClick={onOpenCalendar}
              >
                <Sparkles size={17} aria-hidden="true" />
                <span>
                  <strong>{dueReminders[0].title} 已到期</strong>
                  <small>
                    {dueReminders.length > 1
                      ? `还有 ${dueReminders.length - 1} 条事项`
                      : "点击查看日历"}
                  </small>
                </span>
                <ChevronRight size={17} aria-hidden="true" />
              </button>
            )}

            <button
              type="button"
              className="enter-animal-button"
              onClick={() => onEnterAnimal(activeAnimal.id)}
            >
              进入{activeAnimal.name}的世界
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </section>
        </>
      )}

      {libraryOpen && (
        <PresetLibrary
          existingPresetIds={state.animals.map((animal) => animal.presetId)}
          onAdd={onAddPreset}
          onOpenCreator={onOpenCreator}
          onClose={() => setLibraryOpen(false)}
        />
      )}

      {deleteOpen && activeAnimal && (
        <div className="modal-backdrop">
          <section className="confirm-dialog" role="alertdialog" aria-modal="true">
            <p className="eyebrow">REMOVE COMPANION</p>
            <h2>要和{activeAnimal.name}告别吗？</h2>
            <p>它的喂养值、优惠券和日历记录也会一起移除。</p>
            <div>
              <button type="button" onClick={() => setDeleteOpen(false)}>
                取消
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={() => {
                  onDeleteAnimal(activeAnimal.id);
                  setDeleteOpen(false);
                }}
              >
                确认删除
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
