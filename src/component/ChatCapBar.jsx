import { useState, useEffect, useRef } from "react";
import { Gauge, RotateCcw, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  getcontactmessageusage,
  setcontactmessagelimit,
  resetcontactmessagecount,
} from "../api/livechats";

// Slim strip under the chat header showing how much of this contact's AI
// reply allowance is used. `refreshKey` lets the parent re-pull the count
// after new messages arrive without this component polling on its own.
export default function ChatCapBar({ contactId, refreshKey }) {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftLimit, setDraftLimit] = useState("");
  const [saving, setSaving] = useState(false);
  const popoverRef = useRef(null);

  // Re-reads usage on mount and whenever the parent signals new messages.
  // The parent keys this component by contactId, so switching chats remounts
  // it and state resets — otherwise the bar would briefly show the previous
  // contact's numbers against the new contact's name.
  useEffect(() => {
    let cancelled = false;

    getcontactmessageusage(contactId)
      .then((res) => {
        if (!cancelled) setUsage(res.data.usage);
      })
      .catch(() => {
        // A failed usage read shouldn't interrupt the chat — the bar just
        // stays hidden rather than firing a toast on every refresh.
        if (!cancelled) setUsage(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [contactId, refreshKey]);

  // Called from event handlers rather than effects, so setState is fine here.
  const refetchUsage = async () => {
    try {
      const res = await getcontactmessageusage(contactId);
      setUsage(res.data.usage);
    } catch {
      setUsage(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editing && popoverRef.current && !popoverRef.current.contains(event.target)) {
        setEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editing]);

  const handleReset = async () => {
    setResetting(true);
    try {
      const res = await resetcontactmessagecount(contactId);
      toast.success(res.data.message || "Message count reset");
      await refetchUsage();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset message count");
    } finally {
      setResetting(false);
    }
  };

  const handleSaveLimit = async () => {
    const trimmed = draftLimit.trim();
    // Empty clears the per-contact override and falls back to the global cap.
    const parsed = trimmed === "" ? null : Number(trimmed);

    if (parsed !== null && (!Number.isInteger(parsed) || parsed < 1)) {
      toast.error("Limit must be a whole number of 1 or more");
      return;
    }

    setSaving(true);
    try {
      const res = await setcontactmessagelimit(contactId, parsed);
      toast.success(res.data.message || "Limit updated");
      setEditing(false);
      await refetchUsage();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update limit");
    } finally {
      setSaving(false);
    }
  };

  const openEditor = () => {
    setDraftLimit(usage?.override != null ? String(usage.override) : "");
    setEditing(true);
  };

  if (loading || !usage) return null;

  const { used, limit, reached, override } = usage;
  const uncapped = limit === null;
  const percent = uncapped ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const nearLimit = !uncapped && !reached && percent >= 80;

  // Track colour walks the theme's teal up to amber and then red, so the
  // state reads at a glance without leaving the palette.
  const barColor = reached
    ? "bg-[#DC2626]"
    : nearLimit
      ? "bg-[#F59E0B]"
      : "bg-[#0EA894]";

  const stripBg = reached
    ? "bg-[#FEF2F2] border-[#FECACA]"
    : nearLimit
      ? "bg-[#FFFBEB] border-[#FDE68A]"
      : "bg-white border-[#E5E7EB]";

  const labelColor = reached
    ? "text-[#B91C1C]"
    : nearLimit
      ? "text-[#B45309]"
      : "text-[#6B7280]";

  return (
    <div className={`relative flex-none border-b px-4 py-2 ${stripBg}`}>
      <div className="flex items-center gap-3">
        <Gauge
          size={15}
          className={`flex-none ${reached ? "text-[#DC2626]" : nearLimit ? "text-[#D97706]" : "text-[#0EA894]"}`}
        />

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className={`flex-none text-xs font-medium ${labelColor}`}>
            {reached ? "AI paused — reply manually" : "AI replies"}
          </span>

          {!uncapped && (
            <div className="hidden h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#E5E7EB] sm:block">
              <div
                className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          )}

          <span className={`flex-none text-xs tabular-nums ${labelColor}`}>
            {uncapped ? (
              <span className="flex items-center gap-1">
                <span className="text-sm leading-none">&#8734;</span> No limit
              </span>
            ) : (
              <>
                <span className="font-semibold text-[#1F2937]">{used}</span> / {limit}
              </>
            )}
          </span>

          {override != null && (
            <span className="hidden flex-none rounded-full bg-[#0EA894]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0B6F60] md:inline">
              Custom
            </span>
          )}
        </div>

        <div className="flex flex-none items-center gap-1">
          <button
            onClick={openEditor}
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-[#0B6F60] transition hover:bg-[#0EA894]/10"
          >
            {uncapped ? "Set limit" : "Limit"}
          </button>

          <button
            onClick={handleReset}
            disabled={resetting || (used === 0 && !reached)}
            title="Reset this contact's message count"
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-[#0B6F60] transition hover:bg-[#0EA894]/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw size={12} className={resetting ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {editing && (
        <div
          ref={popoverRef}
          className="absolute right-3 top-full z-50 mt-1 w-64 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
        >
          <h4 className="text-sm font-semibold text-[#1F2937]">Message limit</h4>
          <p className="mt-0.5 text-xs text-[#6B7280]">
            Max AI replies for this contact. Leave empty to use the global setting.
          </p>

          <input
            type="number"
            min="1"
            autoFocus
            value={draftLimit}
            placeholder="Global default"
            onChange={(e) => setDraftLimit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !saving) handleSaveLimit();
              if (e.key === "Escape") setEditing(false);
            }}
            className="mt-3 w-full rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#1F2937] outline-none transition focus:border-[#0EA894] focus:ring-4 focus:ring-[#0EA894]/10"
          />

          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1 rounded-xl border border-[#D1D5DB] px-3 py-1.5 text-xs font-medium text-[#6B7280] transition hover:bg-gray-50"
            >
              <X size={12} /> Cancel
            </button>
            <button
              onClick={handleSaveLimit}
              disabled={saving}
              className="flex items-center gap-1 rounded-xl bg-[#0B6F60] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#0B8A79] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={12} /> {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
