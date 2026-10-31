import { useState } from "react";
import { BadgeCheck, CircleUserRound, RotateCcw, Save, Ticket } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import type { LocalIdentity, LoginStyle, WorldState } from "../domain/world";

interface ProfileScreenProps {
  state: WorldState;
  onBack: () => void;
  onSave: (identity: LocalIdentity, style: LoginStyle) => void;
  onReset: () => void;
  onOpenCalendar: () => void;
  onOpenScanner: () => void;
  onOpenCoupons: () => void;
}

const styleOptions: Array<{
  id: LoginStyle;
  label: string;
  icon: typeof Ticket;
}> = [
  { id: "ticket", label: "入园门票", icon: Ticket },
  { id: "keeper", label: "工作证", icon: BadgeCheck },
  { id: "minimal", label: "极简头像", icon: CircleUserRound },
];

const avatarColors = ["fern", "rose", "honey", "moss", "sky", "plum"];

export function ProfileScreen({
  state,
  onBack,
  onSave,
  onReset,
  onOpenCalendar,
  onOpenScanner,
  onOpenCoupons,
}: ProfileScreenProps) {
  const [nickname, setNickname] = useState(state.identity?.nickname ?? "");
  const [avatar, setAvatar] = useState(state.identity?.avatar ?? "fern");
  const [style, setStyle] = useState<LoginStyle>(state.loginStyle);
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <main className={`world-screen profile-screen profile-screen--${style}`}>
      <AppHeader
        nickname={state.identity?.nickname}
        title="我的资料"
        onBack={onBack}
        onOpenCalendar={onOpenCalendar}
        onOpenScanner={onOpenScanner}
        onOpenCoupons={onOpenCoupons}
        onOpenProfile={() => undefined}
      />
      <div className="profile-layout">
        <section className={`profile-pass profile-pass--${style}`}>
          <p className="eyebrow">LOCAL VISITOR PASS</p>
          <div className="profile-pass__avatar">{nickname.slice(0, 1) || "你"}</div>
          <h1>{nickname || "你的名字"}</h1>
          <span>{styleOptions.find((option) => option.id === style)?.label}</span>
          <div className="profile-pass__meta">
            <small>动物伙伴</small>
            <strong>{state.animals.length}</strong>
            <small>累计记录</small>
            <strong>{state.journal.length}</strong>
          </div>
          <em>NEARER · 2026</em>
        </section>

        <section className="profile-form">
          <div className="creator-section-heading">
            <span>01</span>
            <div>
              <strong>身份样式</strong>
              <small>只改变外观，不改变数据</small>
            </div>
          </div>
          <div className="profile-style-grid">
            {styleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={style === option.id ? "is-active" : ""}
                  onClick={() => setStyle(option.id)}
                >
                  <Icon size={18} aria-hidden="true" />
                  {option.label}
                </button>
              );
            })}
          </div>
          <label>
            <span>昵称</span>
            <input
              value={nickname}
              maxLength={12}
              onChange={(event) => setNickname(event.target.value)}
            />
          </label>
          <fieldset className="avatar-picker">
            <legend>头像颜色</legend>
            <div>
              {avatarColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`avatar-swatch avatar-swatch--${color} ${
                    avatar === color ? "is-selected" : ""
                  }`}
                  aria-label={`选择${color}头像`}
                  onClick={() => setAvatar(color)}
                />
              ))}
            </div>
          </fieldset>
          <button
            type="button"
            className="primary-large-button"
            disabled={!nickname.trim()}
            onClick={() => onSave({ nickname: nickname.trim(), avatar }, style)}
          >
            <Save size={17} aria-hidden="true" />
            保存资料
          </button>
          <button
            type="button"
            className="profile-reset-button"
            onClick={() => setResetOpen(true)}
          >
            <RotateCcw size={16} aria-hidden="true" />
            清空本机身份和动物数据
          </button>
        </section>
      </div>

      {resetOpen && (
        <div className="modal-backdrop">
          <section className="confirm-dialog" role="alertdialog" aria-modal="true">
            <p className="eyebrow">RESET LOCAL WORLD</p>
            <h2>清空当前动物世界？</h2>
            <p>身份、动物、日历和优惠券都会从这台设备删除，无法恢复。</p>
            <div>
              <button type="button" onClick={() => setResetOpen(false)}>取消</button>
              <button
                type="button"
                className="danger-button"
                onClick={() => {
                  onReset();
                  setResetOpen(false);
                }}
              >
                确认清空
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
