import { useState } from "react";
import { ArrowLeft, Keyboard, ScanLine } from "lucide-react";
import { QrCameraReader } from "../components/QrCameraReader";
import { PRESET_ANIMAL_IDS } from "../domain/preset-animals";
import type { WorldState } from "../domain/world";
import { interpretScanResult } from "../lib/scanner";

interface ScannerScreenProps {
  state: WorldState;
  onBack: () => void;
  onDetected: (animalId: string) => void;
}

export function ScannerScreen({
  state,
  onBack,
  onDetected,
}: ScannerScreenProps) {
  const [manual, setManual] = useState("");
  const [error, setError] = useState("");
  const knownIds = [
    ...PRESET_ANIMAL_IDS.map((id) => `preset-${id}`),
    ...state.animals.filter((animal) => animal.kind === "custom").map((animal) => animal.id),
  ];

  function handleCode(value: string) {
    const result = interpretScanResult(value, knownIds);
    if (result.animalId && result.source !== "invalid") {
      onDetected(result.animalId);
      return;
    }
    setError("没有找到这个园区伙伴，请检查编号后重试。");
  }

  return (
    <main className="world-screen scanner-screen">
      <header className="scanner-header">
        <button
          type="button"
          className="header-icon-button"
          aria-label="关闭扫码"
          onClick={onBack}
        >
          <ArrowLeft size={19} aria-hidden="true" />
        </button>
        <div>
          <p className="eyebrow">PARK QR</p>
          <h1>扫码见它</h1>
        </div>
      </header>
      <section className="scanner-panel">
        <div className="scanner-intro">
          <ScanLine size={25} aria-hidden="true" />
          <div>
            <strong>对准园区动物牌上的二维码</strong>
            <span>识别后会直接打开对应动物详情。</span>
          </div>
        </div>
        <QrCameraReader onDetected={handleCode} />
        <form
          className="manual-code"
          onSubmit={(event) => {
            event.preventDefault();
            handleCode(manual);
          }}
        >
          <label htmlFor="manual-animal-code">
            <Keyboard size={16} aria-hidden="true" />
            手动输入动物编号
          </label>
          <div>
            <input
              id="manual-animal-code"
              value={manual}
              placeholder="例如 preset-tiger"
              onChange={(event) => {
                setManual(event.target.value);
                setError("");
              }}
            />
            <button type="submit" disabled={!manual.trim()}>
              打开
            </button>
          </div>
        </form>
        {error && <p className="form-error" role="alert">{error}</p>}
      </section>
    </main>
  );
}
