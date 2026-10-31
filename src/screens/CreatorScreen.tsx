import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  LoaderCircle,
  MousePointerClick,
  Trash2,
  Upload,
} from "lucide-react";
import { AnimalArtworkStage } from "../components/AnimalArtworkStage";
import { TouchEffectPicker } from "../components/TouchEffectPicker";
import { COUPON_OFFERS } from "../domain/coupons";
import type { TouchEffect } from "../domain/preset-animals";
import type { CustomAnimalInput, Touchpoint } from "../domain/world";
import { compressArtwork } from "../lib/image-processing";

interface CreatorScreenProps {
  onBack: () => void;
  onSave: (input: CustomAnimalInput, blob: Blob) => Promise<void>;
}

const themes = ["moss", "rose", "honey", "sky", "plum", "sand"];

function makeId() {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CreatorScreen({ onBack, onSave }: CreatorScreenProps) {
  const [file, setFile] = useState<File | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [theme, setTheme] = useState("moss");
  const [couponOfferId, setCouponOfferId] = useState(COUPON_OFFERS[0].id);
  const [threshold, setThreshold] = useState(30);
  const [touchpoints, setTouchpoints] = useState<Touchpoint[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [effect, setEffect] = useState<TouchEffect>("hearts");
  const [label, setLabel] = useState("摸摸");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selected = useMemo(
    () => touchpoints.find((touchpoint) => touchpoint.id === selectedId) ?? null,
    [selectedId, touchpoints],
  );

  useEffect(() => {
    if (!file) return;
    let active = true;
    setProcessing(true);
    setError("");
    void compressArtwork(file)
      .then((result) => {
        if (!active) return;
        setBlob(result.blob);
        const url = URL.createObjectURL(result.blob);
        setPreviewUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return url;
        });
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "图片处理失败");
        }
      })
      .finally(() => {
        if (active) setProcessing(false);
      });
    return () => {
      active = false;
    };
  }, [file]);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  function addTouchpoint(x: number, y: number) {
    if (touchpoints.length >= 12) {
      setError("每只动物最多设置 12 个触摸点");
      return;
    }
    const id = `touch-${Date.now()}-${touchpoints.length + 1}`;
    const point: Touchpoint = { id, x, y, effect, label: label.slice(0, 6) };
    setTouchpoints((current) => [...current, point]);
    setSelectedId(id);
  }

  function updateSelected(patch: Partial<Touchpoint>) {
    if (!selectedId) return;
    setTouchpoints((current) =>
      current.map((point) =>
        point.id === selectedId ? { ...point, ...patch } : point,
      ),
    );
  }

  async function save() {
    if (!blob) {
      setError("请先上传一张画作");
      return;
    }
    if (!name.trim() || !species.trim()) {
      setError("请为动物填写名称和物种");
      return;
    }
    if (!touchpoints.length) {
      setError("请至少在画作上添加一个触摸点");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const id = makeId();
      await onSave(
        {
          id,
          name: name.trim(),
          species: species.trim(),
          theme,
          couponOfferId,
          threshold,
          touchpoints,
          artworkAssetId: id,
        },
        blob,
      );
    } catch {
      setError("画作保存失败，请稍后再试");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="world-screen creator-screen">
      <header className="creator-header">
        <button
          type="button"
          className="header-icon-button"
          aria-label="返回动物世界"
          onClick={onBack}
        >
          <ArrowLeft size={19} aria-hidden="true" />
        </button>
        <div>
          <p className="eyebrow">MAKE A NEW COMPANION</p>
          <h1>原创动物创作台</h1>
        </div>
      </header>

      <div className="creator-layout">
        <section className="creator-stage-card">
          {!previewUrl ? (
            <label className="upload-dropzone">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                aria-label="上传动物画作"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
              {processing ? (
                <LoaderCircle className="is-spinning" size={30} aria-hidden="true" />
              ) : (
                <ImagePlus size={34} aria-hidden="true" />
              )}
              <strong>{processing ? "正在整理画作" : "上传你的动物画作"}</strong>
              <span>PNG / JPG / WebP，最长边自动优化至 1600px</span>
            </label>
          ) : (
            <>
              <div className="creator-stage-toolbar">
                <span>
                  <MousePointerClick size={16} aria-hidden="true" />
                  点击画面添加触摸点
                </span>
                <span>{touchpoints.length} / 12</span>
              </div>
              <AnimalArtworkStage
                artworkUrl={previewUrl}
                touchpoints={touchpoints}
                editing
                selectedTouchpointId={selectedId}
                onAddTouchpoint={addTouchpoint}
                onSelectTouchpoint={setSelectedId}
                onMoveTouchpoint={(id, x, y) =>
                  setTouchpoints((current) =>
                    current.map((point) =>
                      point.id === id ? { ...point, x, y } : point,
                    ),
                  )
                }
              />
            </>
          )}
        </section>

        <section className="creator-form">
          <div className="creator-section-heading">
            <span>01</span>
            <div>
              <strong>它是谁</strong>
              <small>给新伙伴一个名字</small>
            </div>
          </div>
          <div className="form-grid">
            <label>
              <span>动物名称</span>
              <input
                value={name}
                maxLength={12}
                placeholder="例如：小云"
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label>
              <span>物种</span>
              <input
                value={species}
                maxLength={12}
                placeholder="例如：云朵兽"
                onChange={(event) => setSpecies(event.target.value)}
              />
            </label>
          </div>

          <div className="creator-section-heading">
            <span>02</span>
            <div>
              <strong>它喜欢什么</strong>
              <small>选择喂养门槛和专属优惠</small>
            </div>
          </div>
          <label className="range-field">
            <span>喂养值门槛：{threshold}</span>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
            />
          </label>
          <div className="theme-picker" role="group" aria-label="动物主题色">
            {themes.map((item) => (
              <button
                key={item}
                type="button"
                className={`theme-dot theme-dot--${item} ${theme === item ? "is-active" : ""}`}
                aria-label={`选择${item}主题色`}
                onClick={() => setTheme(item)}
              />
            ))}
          </div>
          <label>
            <span>专属优惠券</span>
            <select
              value={couponOfferId}
              onChange={(event) =>
                setCouponOfferId(event.target.value as typeof couponOfferId)
              }
            >
              {COUPON_OFFERS.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.title}
                </option>
              ))}
            </select>
          </label>

          {previewUrl && (
            <>
              <div className="creator-section-heading">
                <span>03</span>
                <div>
                  <strong>触摸它</strong>
                  <small>为每个点选择一段小动作</small>
                </div>
              </div>
              <label>
                <span>提示文字</span>
                <input
                  value={label}
                  maxLength={6}
                  onChange={(event) => {
                    setLabel(event.target.value);
                    updateSelected({ label: event.target.value });
                  }}
                />
              </label>
              <TouchEffectPicker
                value={selected?.effect ?? effect}
                onChange={(nextEffect) => {
                  setEffect(nextEffect);
                  updateSelected({ effect: nextEffect });
                }}
              />
              {selected && (
                <button
                  type="button"
                  className="delete-touchpoint"
                  onClick={() => {
                    setTouchpoints((current) =>
                      current.filter((point) => point.id !== selected.id),
                    );
                    setSelectedId(null);
                  }}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  删除当前触摸点
                </button>
              )}
            </>
          )}

          {error && <p className="form-error" role="alert">{error}</p>}
          <button
            type="button"
            className="primary-large-button creator-save"
            disabled={saving || processing}
            onClick={() => void save()}
          >
            {saving ? <LoaderCircle className="is-spinning" size={18} /> : <Check size={18} />}
            保存并进入它的世界
          </button>
        </section>
      </div>
    </main>
  );
}
