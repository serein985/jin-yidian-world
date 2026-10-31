import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthCalendarProps {
  month: Date;
  selectedDate: string;
  markers: Record<string, string[]>;
  onChangeMonth: (date: Date) => void;
  onSelectDate: (date: string) => void;
}

const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

function keyForDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function MonthCalendar({
  month,
  selectedDate,
  markers,
  onChangeMonth,
  onSelectDate,
}: MonthCalendarProps) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const dayOffset = (first.getDay() + 6) % 7;
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - dayOffset);
  const today = keyForDate(new Date());

  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });

  return (
    <section className="month-calendar">
      <div className="month-calendar__heading">
        <button
          type="button"
          aria-label="上一个月"
          onClick={() =>
            onChangeMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <div>
          <strong>
            {month.getFullYear()} 年 {month.getMonth() + 1} 月
          </strong>
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              onChangeMonth(new Date(now.getFullYear(), now.getMonth(), 1));
              onSelectDate(today);
            }}
          >
            回到今天
          </button>
        </div>
        <button
          type="button"
          aria-label="下一个月"
          onClick={() =>
            onChangeMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="calendar-weekdays" aria-hidden="true">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((date) => {
          const key = keyForDate(date);
          const isCurrentMonth = date.getMonth() === month.getMonth();
          const eventTypes = markers[key] ?? [];
          return (
            <button
              key={key}
              type="button"
              className={`calendar-day ${
                key === selectedDate ? "is-selected" : ""
              } ${key === today ? "is-today" : ""} ${
                isCurrentMonth ? "" : "is-outside"
              }`}
              aria-label={`${date.getMonth() + 1}月${date.getDate()}日，${
                eventTypes.length ? `${eventTypes.length}条事项` : "没有事项"
              }`}
              aria-pressed={key === selectedDate}
              onClick={() => onSelectDate(key)}
            >
              <span>{date.getDate()}</span>
              <i>
                {eventTypes.slice(0, 3).map((type) => (
                  <b key={type} className={`event-dot event-dot--${type}`} />
                ))}
              </i>
            </button>
          );
        })}
      </div>
    </section>
  );
}
