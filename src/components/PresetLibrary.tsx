import { Plus, WandSparkles, X } from "lucide-react";
import {
  PRESET_ANIMALS,
  type PresetAnimalId,
} from "../domain/preset-animals";

interface PresetLibraryProps {
  existingPresetIds: Array<PresetAnimalId | null>;
  onAdd: (presetId: PresetAnimalId) => void;
  onOpenCreator: () => void;
  onClose: () => void;
}

export function PresetLibrary({
  existingPresetIds,
  onAdd,
  onOpenCreator,
  onClose,
}: PresetLibraryProps) {
  return (
    <div className="modal-backdrop library-backdrop">
      <section
        className="preset-library"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preset-library-title"
      >
        <header className="sheet-header">
          <div>
            <p className="eyebrow">ADD A COMPANION</p>
            <h2 id="preset-library-title">添加动物</h2>
          </div>
          <button
            className="round-icon-button round-icon-button--light"
            type="button"
            aria-label="关闭动物库"
            onClick={onClose}
          >
            <X size={19} aria-hidden="true" />
          </button>
        </header>

        <button type="button" className="creator-entry" onClick={onOpenCreator}>
          <span>
            <WandSparkles size={24} aria-hidden="true" />
          </span>
          <div>
            <strong>带一张自己的画来</strong>
            <small>上传画作，设置触摸点和动画</small>
          </div>
          <Plus size={18} aria-hidden="true" />
        </button>

        <div className="preset-heading">
          <strong>预设动物</strong>
          <span>选择一只喜欢的伙伴</span>
        </div>
        <div className="preset-grid">
          {PRESET_ANIMALS.map((animal) => {
            const added = existingPresetIds.includes(animal.id);
            return (
              <button
                key={animal.id}
                type="button"
                className={`preset-card preset-card--${animal.id}`}
                disabled={added}
                aria-label={added ? `已添加${animal.name}` : `添加${animal.name}`}
                onClick={() => onAdd(animal.id)}
              >
                <span className="preset-orb">
                  <i />
                  <i />
                </span>
                <span>
                  <strong>{animal.name}</strong>
                  <small>{animal.species}</small>
                </span>
                <em>{added ? "已有" : animal.habitat}</em>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
