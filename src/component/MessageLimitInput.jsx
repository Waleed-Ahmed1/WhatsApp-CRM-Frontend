import { useState } from "react";
import { Infinity as InfinityIcon } from "lucide-react";

// Shared by the global setting and the per-group default. The API models "no
// cap" as null rather than 0, so the toggle and the number field are separate
// controls — typing 0 is rejected server-side and is not how you disable it.
//
// `draft` is seeded once at mount and never synced from props by an effect.
// Callers that swap the underlying record (e.g. selecting a different group)
// must pass a `key` so this remounts with the right initial value.
export default function MessageLimitInput({
  value,            // number | null
  onChange,         // (number | null) => void
  disabled = false,
  unlimitedLabel = "No limit",
  inheritLabel,     // shown instead of unlimitedLabel when clearing means "inherit"
}) {
  const [draft, setDraft] = useState(value == null ? "" : String(value));

  const isUnlimited = value == null;

  const handleNumber = (raw) => {
    setDraft(raw);
    if (raw.trim() === "") {
      onChange(null);
      return;
    }
    const parsed = Number(raw);
    if (Number.isInteger(parsed) && parsed >= 1) onChange(parsed);
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => { setDraft(""); onChange(null); }}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed ${
            isUnlimited
              ? "bg-[#0EA894]/10 text-[#0B6F60]"
              : "text-[#6B7280] hover:bg-[#F3F4F6]"
          }`}
        >
          <InfinityIcon size={13} />
          {inheritLabel || unlimitedLabel}
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => { if (isUnlimited) { setDraft("50"); onChange(50); } }}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed ${
            !isUnlimited
              ? "bg-[#0EA894]/10 text-[#0B6F60]"
              : "text-[#6B7280] hover:bg-[#F3F4F6]"
          }`}
        >
          Set a limit
        </button>
      </div>

      {!isUnlimited && (
        <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 transition-all duration-200 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20">
          <input
            type="number"
            min="1"
            step="1"
            value={draft}
            disabled={disabled}
            onChange={(e) => handleNumber(e.target.value)}
            className="w-full bg-transparent text-sm text-[#1F2937] outline-none placeholder:text-[#9CA3AF]"
            placeholder="e.g. 50"
          />
          <span className="flex-none text-xs text-[#9CA3AF]">replies</span>
        </div>
      )}
    </div>
  );
}
