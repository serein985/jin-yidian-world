import { useState } from "react";
import { BadgeCheck, CircleUserRound, Ticket } from "lucide-react";
import type { LocalIdentity, LoginStyle } from "../domain/world";

interface LoginScreenProps {
  initialStyle?: LoginStyle;
  pendingAnimalName?: string;
  onEnter: (identity: LocalIdentity, style: LoginStyle) => void;
}

const styles: Array<{
  id: LoginStyle;
  label: string;
  subtitle: string;
  icon: typeof Ticket;
}> = [
  {
    id: "ticket",
    label: "入园门票",
    subtitle: "像收下一张今天的邀请",
    icon: Ticket,
  },
  {
    id: "keeper",
    label: "饲养员工作证",
    subtitle: "离动物更近一点",
    icon: BadgeCheck,
  },
  {
    id: "minimal",
    label: "极简头像",
    subtitle: "只留下你和它的名字",
    icon: CircleUserRound,
  },
];

const avatarColors = ["fern", "rose", "honey", "moss", "sky", "plum"];

export function LoginScreen({
  initialStyle = "ticket",
  pendingAnimalName,
  onEnter,
}: LoginScreenProps) {
  const [style, setStyle] = useState<LoginStyle>(initialStyle);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("fern");
  const valid = nickname.trim().length > 0 && nickname.trim().length <= 12;

  return (
    <main className={`login-screen login-screen--${style}`}>
      <div className="login-atmosphere" aria-hidden="true">
        <span className="login-light login-light--one" />
        <span className="login-light login-light--two" />
        <span className="login-branch" />
        <span className="login-leaf login-leaf--one" />
        <span className="login-leaf login-leaf--two" />
      </div>

      <section className="login-intro">
        <p className="eyebrow">NEARER · ANIMAL WORLD</p>
        <h1>把喜欢的动物，<br />放进今天的世界。</h1>
        <p>
          选择一只预设动物，或带上一张自己的画。每一次靠近，都会被认真记住。
        </p>
        {pendingAnimalName && (
          <span className="login-pending">登录后直接去见{pendingAnimalName}</span>
        )}
      </section>

      <form
        className="login-card"
        onSubmit={(event) => {
          event.preventDefault();
          if (valid) {
            onEnter({ nickname: nickname.trim(), avatar }, style);
          }
        }}
      >
        <div className="login-style-tabs" role="group" aria-label="登录视觉样式">
          {styles.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                type="button"
                className={style === option.id ? "is-active" : ""}
                aria-label={`选择${option.label}风格`}
                aria-pressed={style === option.id}
                onClick={() => setStyle(option.id)}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>

        <div className="identity-preview">
          <span className={`identity-avatar identity-avatar--${avatar}`}>
            {nickname.trim().slice(0, 1) || "你"}
          </span>
          <div>
            <strong>{nickname.trim() || "写下你的名字"}</strong>
            <small>{styles.find((option) => option.id === style)?.subtitle}</small>
          </div>
          <span className="identity-pass-code">P-2026</span>
        </div>

        <label className="field-label" htmlFor="login-nickname">
          游客昵称
        </label>
        <input
          id="login-nickname"
          className="text-input"
          value={nickname}
          maxLength={12}
          placeholder="例如：小满"
          autoComplete="nickname"
          onChange={(event) => setNickname(event.target.value)}
        />

        <fieldset className="avatar-picker">
          <legend>选择头像颜色</legend>
          <div>
            {avatarColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`avatar-swatch avatar-swatch--${color} ${
                  avatar === color ? "is-selected" : ""
                }`}
                aria-label={`选择${color}头像`}
                aria-pressed={avatar === color}
                onClick={() => setAvatar(color)}
              />
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="primary-large-button"
          disabled={!valid}
        >
          进入我的动物世界
        </button>
        <p className="login-footnote">仅保存在当前设备，不需要短信或密码</p>
      </form>
    </main>
  );
}
