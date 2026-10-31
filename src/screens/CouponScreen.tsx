import { useEffect, useState } from "react";
import { Check, Ticket, X } from "lucide-react";
import QRCode from "qrcode";
import { AppHeader } from "../components/AppHeader";
import { getCouponOffer } from "../domain/coupons";
import type { WorldState } from "../domain/world";

interface CouponScreenProps {
  state: WorldState;
  onBack: () => void;
  onRedeem: (animalId: string) => boolean;
  onOpenCalendar: () => void;
  onOpenScanner: () => void;
  onOpenProfile: () => void;
}

type Filter = "all" | "available" | "redeemed";

function CouponQr({ code }: { code: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    void QRCode.toString(code, {
      type: "svg",
      width: 160,
      margin: 0,
      color: { dark: "#254535", light: "#fbf7e8" },
    }).then(setSvg);
  }, [code]);
  return (
    <div
      className="coupon-qr-mark"
      aria-label={`核销二维码 ${code}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function CouponScreen({
  state,
  onBack,
  onRedeem,
  onOpenCalendar,
  onOpenScanner,
  onOpenProfile,
}: CouponScreenProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const visible = state.animals.filter((animal) => {
    const status = state.progress[animal.id]?.coupon?.status;
    return (
      filter === "all" ||
      (filter === "available" && status === "available") ||
      (filter === "redeemed" && status === "redeemed")
    );
  });
  const availableCount = Object.values(state.progress).filter(
    (progress) => progress.coupon?.status === "available",
  ).length;
  const redeemedCount = Object.values(state.progress).filter(
    (progress) => progress.coupon?.status === "redeemed",
  ).length;

  return (
    <main className="world-screen coupon-screen">
      <AppHeader
        nickname={state.identity?.nickname}
        title="我的券包"
        onBack={onBack}
        onOpenCalendar={onOpenCalendar}
        onOpenScanner={onOpenScanner}
        onOpenCoupons={() => undefined}
        onOpenProfile={onOpenProfile}
      />
      <div className="coupon-screen__intro">
        <p className="eyebrow">SMALL REWARDS</p>
        <h1>每一次靠近，<br />都有一张专属票券。</h1>
        <div>
          <span>可出示 {availableCount}</span>
          <span>已核销 {redeemedCount}</span>
          <span>共 {state.animals.length} 张</span>
        </div>
      </div>
      <div className="coupon-filters" role="group" aria-label="优惠券筛选">
        {[
          ["all", "全部"],
          ["available", "可出示"],
          ["redeemed", "已核销"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={filter === id ? "is-active" : ""}
            onClick={() => setFilter(id as Filter)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="coupon-cards">
        {visible.map((animal) => {
          const progress = state.progress[animal.id];
          const offer = getCouponOffer(animal.couponOfferId);
          const coupon = progress.coupon;
          const status = coupon?.status ?? "locked";
          const percent = Math.min(100, (progress.feedingValue / animal.threshold) * 100);
          return (
            <article
              key={animal.id}
              className={`world-coupon world-coupon--${status} world-coupon--${animal.theme}`}
            >
              <div className="world-coupon__stamp">{animal.name.slice(0, 1)}</div>
              <div className="world-coupon__body">
                <header>
                  <div>
                    <p>{animal.name}的专属奖励</p>
                    <h2>{offer.title}</h2>
                  </div>
                  <span>{status === "available" ? "可出示" : status === "redeemed" ? "已核销" : "未解锁"}</span>
                </header>
                <p>{offer.summary}</p>
                {!coupon && (
                  <>
                    <div className="world-coupon__progress">
                      <span style={{ width: `${percent}%` }} />
                    </div>
                    <small>
                      {progress.feedingValue} / {animal.threshold} · 还差 {Math.max(0, animal.threshold - progress.feedingValue)} 点
                    </small>
                  </>
                )}
                {coupon?.status === "available" && (
                  <>
                    <button
                      type="button"
                      className="coupon-reveal-button"
                      aria-label={`出示${animal.name}的优惠券`}
                      onClick={() => setExpandedId(animal.id)}
                    >
                      <Ticket size={17} aria-hidden="true" />
                      出示核销码
                    </button>
                    {expandedId === animal.id && (
                      <div className="coupon-reveal-area">
                        <CouponQr code={coupon.code} />
                        <div>
                          <strong>{coupon.code}</strong>
                          <span>{offer.terms}</span>
                          {confirmId !== animal.id ? (
                            <button type="button" onClick={() => setConfirmId(animal.id)}>
                              模拟店员核销
                            </button>
                          ) : (
                            <div className="coupon-confirm-actions">
                              <span>确认后立即失效</span>
                              <button type="button" onClick={() => setConfirmId(null)}>
                                <X size={14} aria-hidden="true" />取消
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onRedeem(animal.id);
                                  setConfirmId(null);
                                  setExpandedId(null);
                                }}
                              >
                                <Check size={14} aria-hidden="true" />确认核销
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {coupon?.status === "redeemed" && (
                  <div className="coupon-used-mark">
                    <span>已核销</span>
                    <small>
                      {coupon.redeemedAt
                        ? new Date(coupon.redeemedAt).toLocaleString("zh-CN", {
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </small>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
