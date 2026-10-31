import { useMemo, useState } from "react";
import {
  Bell,
  CalendarPlus,
  Check,
  ChevronRight,
  Clock3,
  Trash2,
  X,
} from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { MonthCalendar } from "../components/MonthCalendar";
import {
  isAppointmentDue,
  localDateKey,
  type AppointmentInput,
  type WorldState,
} from "../domain/world";

interface CalendarScreenProps {
  state: WorldState;
  onBack: () => void;
  onAddAppointment: (input: AppointmentInput) => void;
  onToggleAppointment: (id: string) => void;
  onRemoveAppointment: (id: string) => void;
  onOpenCoupons: () => void;
  onOpenScanner: () => void;
  onOpenProfile: () => void;
}

export function CalendarScreen({
  state,
  onBack,
  onAddAppointment,
  onToggleAppointment,
  onRemoveAppointment,
  onOpenCoupons,
  onOpenScanner,
  onOpenProfile,
}: CalendarScreenProps) {
  const now = new Date();
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(localDateKey(now));
  const [editorOpen, setEditorOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [animalId, setAnimalId] = useState(state.animals[0]?.id ?? "");
  const [type, setType] = useState<"appointment" | "reminder">("appointment");
  const [time, setTime] = useState("10:00");
  const [note, setNote] = useState("");

  const markers = useMemo(() => {
    const next: Record<string, string[]> = {};
    for (const event of state.journal) {
      next[event.date] ??= [];
      next[event.date].push(event.type);
    }
    for (const appointment of state.appointments) {
      next[appointment.date] ??= [];
      next[appointment.date].push(appointment.type);
    }
    return next;
  }, [state.appointments, state.journal]);

  const dayEvents = state.journal.filter((event) => event.date === selectedDate);
  const dayAppointments = state.appointments
    .filter((appointment) => appointment.date === selectedDate)
    .sort((a, b) => (a.time ?? "00:00").localeCompare(b.time ?? "00:00"));

  function saveAppointment() {
    if (!title.trim() || !animalId) return;
    onAddAppointment({
      animalId,
      type,
      title,
      date: selectedDate,
      time: time || null,
      note,
    });
    setTitle("");
    setNote("");
    setEditorOpen(false);
  }

  return (
    <main className="world-screen calendar-screen">
      <AppHeader
        nickname={state.identity?.nickname}
        title="日历"
        onBack={onBack}
        onOpenCalendar={() => undefined}
        onOpenScanner={onOpenScanner}
        onOpenCoupons={onOpenCoupons}
        onOpenProfile={onOpenProfile}
      />
      <div className="calendar-layout">
        <MonthCalendar
          month={month}
          selectedDate={selectedDate}
          markers={markers}
          onChangeMonth={setMonth}
          onSelectDate={setSelectedDate}
        />

        <section className="day-agenda">
          <header>
            <div>
              <p className="eyebrow">DAILY JOURNAL</p>
              <h2>{selectedDate.replaceAll("-", " / ")}</h2>
            </div>
            <button
              type="button"
              className="primary-small-button"
              onClick={() => setEditorOpen(true)}
            >
              <CalendarPlus size={16} aria-hidden="true" />
              新建
            </button>
          </header>

          {dayAppointments.length === 0 && dayEvents.length === 0 ? (
            <div className="agenda-empty">
              <Bell size={24} aria-hidden="true" />
              <strong>今天还没有记录</strong>
              <span>摸摸动物或添加一条预约，这里会慢慢留下痕迹。</span>
            </div>
          ) : (
            <div className="agenda-timeline">
              {dayAppointments.map((appointment) => {
                const animal = state.animals.find(
                  (candidate) => candidate.id === appointment.animalId,
                );
                const due = isAppointmentDue(appointment, now);
                return (
                  <article
                    key={appointment.id}
                    className={`agenda-item agenda-item--${appointment.type} ${
                      due ? "is-due" : ""
                    } ${appointment.completedAt ? "is-complete" : ""}`}
                  >
                    <span className="agenda-time">
                      {appointment.time ?? "全天"}
                    </span>
                    <div>
                      <em>
                        {due ? "已到期" : appointment.type === "appointment" ? "预约" : "提醒"}
                      </em>
                      <strong>{appointment.title}</strong>
                      <small>
                        {animal?.name ?? "动物"}
                        {appointment.note ? ` · ${appointment.note}` : ""}
                      </small>
                    </div>
                    <div className="agenda-actions">
                      <button
                        type="button"
                        aria-label={appointment.completedAt ? "恢复事项" : "完成事项"}
                        onClick={() => onToggleAppointment(appointment.id)}
                      >
                        <Check size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label="删除事项"
                        onClick={() => onRemoveAppointment(appointment.id)}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                );
              })}
              {dayEvents.map((event) => (
                <article key={event.id} className={`agenda-item agenda-item--${event.type}`}>
                  <span className="agenda-time">{event.time}</span>
                  <div>
                    <em>记录</em>
                    <strong>{event.title}</strong>
                    <small>{event.detail}</small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {editorOpen && (
        <div className="modal-backdrop">
          <section
            className="appointment-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-title"
          >
            <header className="sheet-header">
              <div>
                <p className="eyebrow">NEW PAGE NOTE</p>
                <h2 id="appointment-title">添加日历事项</h2>
              </div>
              <button
                type="button"
                className="round-icon-button round-icon-button--light"
                aria-label="关闭日历事项"
                onClick={() => setEditorOpen(false)}
              >
                <X size={19} aria-hidden="true" />
              </button>
            </header>
            <label>
              <span>事项类型</span>
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as "appointment" | "reminder")
                }
              >
                <option value="appointment">预约</option>
                <option value="reminder">提醒</option>
              </select>
            </label>
            <label>
              <span>标题</span>
              <input
                value={title}
                maxLength={30}
                placeholder="例如：再来看阿呜"
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            <label>
              <span>动物</span>
              <select
                value={animalId}
                onChange={(event) => setAnimalId(event.target.value)}
              >
                {state.animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-grid">
              <label>
                <span>日期</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
              </label>
              <label>
                <span>时间</span>
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />
              </label>
            </div>
            <label>
              <span>备注</span>
              <textarea
                value={note}
                maxLength={120}
                rows={3}
                onChange={(event) => setNote(event.target.value)}
              />
            </label>
            <button
              type="button"
              className="primary-large-button"
              disabled={!title.trim() || !animalId}
              onClick={saveAppointment}
            >
              保存到日历
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
