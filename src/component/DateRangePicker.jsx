import { Calendar } from "lucide-react";

const DAY_MS = 24 * 60 * 60 * 1000;

// The API works in UTC days, so derive the bounds in UTC too — using local
// midnight here is the classic source of an off-by-one day.
const toKey = (date) => date.toISOString().slice(0, 10);

const QUICK_SETS = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

// Native <input type="date"> rather than a picker library: it emits exactly the
// YYYY-MM-DD the API expects, adds zero bytes, and is keyboard- and
// mobile-friendly. The quick-sets just write into the same from/to state, so
// the range stays fully custom.
export default function DateRangePicker({ from, to, onChange, disabled = false }) {
  const today = toKey(new Date());

  const applyQuickSet = (days) => {
    const end = new Date(`${today}T00:00:00.000Z`);
    const start = new Date(end.getTime() - (days - 1) * DAY_MS);
    onChange({ from: toKey(start), to: today });
  };

  const inputClass =
    "bg-transparent text-sm text-[#1F2937] outline-none [&::-webkit-calendar-picker-indicator]:opacity-60";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 rounded-lg bg-white p-1 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
        {QUICK_SETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            disabled={disabled}
            onClick={() => applyQuickSet(preset.days)}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-[#0B6F60] transition hover:bg-[#0EA894]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-all duration-200 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20">
        <Calendar size={14} className="flex-none text-[#0EA894]" />
        <input
          type="date"
          value={from}
          max={to || today}
          disabled={disabled}
          onChange={(e) => onChange({ from: e.target.value, to })}
          className={inputClass}
        />
        <span className="text-xs text-[#9CA3AF]">to</span>
        <input
          type="date"
          value={to}
          min={from}
          max={today}
          disabled={disabled}
          onChange={(e) => onChange({ from, to: e.target.value })}
          className={inputClass}
        />
        <span className="ml-1 flex-none rounded bg-[#EAF7F4] px-1.5 py-0.5 text-[10px] font-medium text-[#0B6F60]">
          UTC
        </span>
      </div>
    </div>
  );
}
