import { useEffect, useRef } from "react";
import { Apple, Beef, Carrot, Cherry, Cookie, Leaf, Wheat, X } from "lucide-react";

interface FeedDrawerProps {
  animalName: string;
  foods: string[];
  canFeed: boolean;
  onChoose: (index: number) => void;
  onClose: () => void;
}

const foodIcons = [Leaf, Apple, Cherry, Wheat, Carrot, Cookie, Beef];

export function FeedDrawer({
  animalName,
  foods,
  canFeed,
  onChoose,
  onClose,
}: FeedDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop modal-backdrop--sheet">
      <section
        className="feed-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feed-title"
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-header">
          <div>
            <p className="eyebrow">KEEPER'S DAILY PORTION</p>
            <h2 id="feed-title">给{animalName}投喂</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="round-icon-button round-icon-button--light"
            aria-label="关闭投喂"
            onClick={onClose}
          >
            <X size={19} aria-hidden="true" />
          </button>
        </header>
        <div className="feeding-note-banner">
          <Leaf size={16} aria-hidden="true" />
          {canFeed ? "饲养员已配好今日份量，只选一种" : "今天的份量已经吃过啦"}
        </div>
        <div className="feed-options">
          {foods.map((food, index) => {
            const Icon = foodIcons[index % foodIcons.length];
            return (
              <button
                key={food}
                type="button"
                disabled={!canFeed}
                onClick={() => onChoose(index)}
              >
                <span>
                  <Icon size={23} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <strong>{food}</strong>
                <small>{canFeed ? "饲养员准备的小份" : "今日已完成"}</small>
              </button>
            );
          })}
        </div>
        <p className="drawer-footnote">数字投喂不会改变线下饲养安排</p>
      </section>
    </div>
  );
}
