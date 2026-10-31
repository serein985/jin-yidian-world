import { useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Heart,
  Sparkles,
  Ticket,
  Utensils,
} from "lucide-react";
import { Animal3DStage } from "../components/animal3d/Animal3DStage";
import { AnimalArtworkStage } from "../components/AnimalArtworkStage";
import { AppHeader } from "../components/AppHeader";
import { FeedDrawer } from "../components/FeedDrawer";
import { PRESET_ANIMALS_BY_ID } from "../domain/preset-animals";
import { localDateKey, type AnimalProfile, type WorldState } from "../domain/world";

interface AnimalDetailScreenProps {
  state: WorldState;
  animal: AnimalProfile;
  artworkUrl: string | null;
  onBack: () => void;
  onPet: (animalId: string) => { rewarded: boolean };
  onFeed: (animalId: string, foodId: string) => boolean;
  onOpenCalendar: () => void;
  onOpenScanner: () => void;
  onOpenCoupons: () => void;
  onOpenProfile: () => void;
}

const customFoods = ["一小份果干", "清甜蔬果", "饲养员饼干"];

export function AnimalDetailScreen({
  state,
  animal,
  artworkUrl,
  onBack,
  onPet,
  onFeed,
  onOpenCalendar,
  onOpenScanner,
  onOpenCoupons,
  onOpenProfile,
}: AnimalDetailScreenProps) {
  const [feedOpen, setFeedOpen] = useState(false);
  const [message, setMessage] = useState(
    animal.kind === "preset"
      ? PRESET_ANIMALS_BY_ID[animal.presetId!]?.tagline ?? "今天也想离你近一点。"
      : "我从你的画里醒来，想和你待一会儿。",
  );
  const progress = state.progress[animal.id];
  const preset = animal.presetId ? PRESET_ANIMALS_BY_ID[animal.presetId] : null;
  const foods = preset?.foods ?? customFoods;
  const percent = Math.min(100, (progress.feedingValue / animal.threshold) * 100);
  const records = state.journal.filter((event) => event.animalId === animal.id);

  function pet() {
    const result = onPet(animal.id);
    setMessage(
      result?.rewarded
        ? "今天的第一次靠近，喂养值 +1。"
        : "它轻轻靠近了一点。",
    );
  }

  function feed(index: number) {
    const accepted = onFeed(animal.id, `food-${index + 1}`);
    setFeedOpen(false);
    setMessage(accepted ? "今天的投喂完成，喂养值 +4。" : "今天的份量已经吃过啦。");
  }

  return (
    <main className={`world-screen detail-screen detail-screen--${animal.theme}`}>
      <div className="world-atmosphere" aria-hidden="true">
        <span className="world-light" />
        <span className="world-mist" />
      </div>
      <AppHeader
        nickname={state.identity?.nickname}
        title={animal.name}
        onBack={onBack}
        onOpenCalendar={onOpenCalendar}
        onOpenScanner={onOpenScanner}
        onOpenCoupons={onOpenCoupons}
        onOpenProfile={onOpenProfile}
      />

      <section className="detail-stage">
        <div className="detail-title">
          <p className="eyebrow">{preset?.habitat ?? "原创伙伴空间"}</p>
          <h1>{animal.name}</h1>
          <span>{animal.species}</span>
        </div>
        <div className="detail-model">
          {preset ? (
            <Animal3DStage
              preset={preset}
              onTouchRegion={pet}
            />
          ) : (
            <AnimalArtworkStage
              artworkUrl={artworkUrl}
              touchpoints={animal.touchpoints}
              editing={false}
              selectedTouchpointId={null}
              onTouchpointTriggered={pet}
            />
          )}
        </div>
        <div className="detail-speech" role="status" aria-live="polite">
          <Sparkles size={16} aria-hidden="true" />
          <span>{message}</span>
        </div>
      </section>

      <section className="detail-panel">
        <div className="detail-progress-heading">
          <div>
            <span>独立喂养值</span>
            <strong>
              {progress.feedingValue}
              <small> / {animal.threshold}</small>
            </strong>
          </div>
          <button type="button" onClick={onOpenCoupons}>
            <Ticket size={17} aria-hidden="true" />
            {progress.coupon
              ? progress.coupon.status === "redeemed"
                ? "已核销"
                : "券已解锁"
              : `还差 ${Math.max(0, animal.threshold - progress.feedingValue)}`}
          </button>
        </div>
        <div
          className="detail-progress-track"
          role="meter"
          aria-label={`${animal.name}的喂养值`}
          aria-valuemin={0}
          aria-valuemax={animal.threshold}
          aria-valuenow={progress.feedingValue}
        >
          <span style={{ width: `${percent}%` }} />
        </div>

        <div className="detail-actions">
          <button type="button" className="secondary-large-button" onClick={pet}>
            <Heart size={18} aria-hidden="true" />
            轻轻摸一下
          </button>
          <button
            type="button"
            className="primary-large-button"
            aria-label={`给${animal.name}投喂`}
            onClick={() => setFeedOpen(true)}
          >
            <Utensils size={18} aria-hidden="true" />
            今日投喂
          </button>
        </div>

        <button type="button" className="record-row" onClick={onOpenCalendar}>
          <CalendarDays size={18} aria-hidden="true" />
          <span>
            <strong>在日历里查看它的记录</strong>
            <small>
              {records.length ? `已有 ${records.length} 条互动记录` : "还没有记录，今天开始吧"}
            </small>
          </span>
          <ChevronRight size={17} aria-hidden="true" />
        </button>
      </section>

      {feedOpen && (
        <FeedDrawer
          animalName={animal.name}
          foods={foods}
          canFeed={progress.lastFeedDate !== localDateKey(new Date())}
          onChoose={feed}
          onClose={() => setFeedOpen(false)}
        />
      )}
    </main>
  );
}
