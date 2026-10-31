import {
  ArrowLeft,
  CalendarDays,
  QrCode,
  Ticket,
  UserRound,
} from "lucide-react";

interface AppHeaderProps {
  nickname?: string;
  title?: string;
  onBack?: () => void;
  onOpenCalendar: () => void;
  onOpenScanner: () => void;
  onOpenCoupons: () => void;
  onOpenProfile: () => void;
}

export function AppHeader({
  nickname,
  title,
  onBack,
  onOpenCalendar,
  onOpenScanner,
  onOpenCoupons,
  onOpenProfile,
}: AppHeaderProps) {
  const Heading = title ? "h2" : "p";
  return (
    <header className="world-header">
      <div className="world-header__identity">
        {onBack ? (
          <button
            className="header-icon-button"
            type="button"
            aria-label="返回"
            onClick={onBack}
          >
            <ArrowLeft size={19} aria-hidden="true" />
          </button>
        ) : (
          <span className="header-brand-mark" aria-hidden="true">
            <i />
            <i />
          </span>
        )}
        <div>
          <Heading>{title ?? "近一点"}</Heading>
          <span>{nickname ? `${nickname}的动物世界` : "林间伙伴收藏册"}</span>
        </div>
      </div>
      <nav className="world-header__actions" aria-label="主要功能">
        <button type="button" aria-label="打开日历" onClick={onOpenCalendar}>
          <CalendarDays size={18} aria-hidden="true" />
        </button>
        <button type="button" aria-label="打开扫码" onClick={onOpenScanner}>
          <QrCode size={18} aria-hidden="true" />
        </button>
        <button type="button" aria-label="打开我的券包" onClick={onOpenCoupons}>
          <Ticket size={18} aria-hidden="true" />
        </button>
        <button type="button" aria-label="打开个人资料" onClick={onOpenProfile}>
          <UserRound size={18} aria-hidden="true" />
        </button>
      </nav>
    </header>
  );
}
