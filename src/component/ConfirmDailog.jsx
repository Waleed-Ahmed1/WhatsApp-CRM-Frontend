import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[320px] overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
      >
        {/* Top banner */}
        <div className="relative flex h-32 items-center justify-center bg-[#0EA894]">
          <button
            onClick={onCancel}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#0B6F60] transition hover:bg-white"
          >
            <X size={14} />
          </button>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <AlertTriangle size={30} className="text-white" />
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-5 text-center">
          <h3 className="text-lg font-semibold text-[#1F2937]">Hang On a Sec!</h3>
          <p className="mt-1.5 text-sm text-[#6B7280]">{message}</p>

          <div className="mt-5 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-[#E5E7EB] py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#F3F4F6]"
            >
              Let Me Rethink
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-[#0B6F60] py-2.5 text-sm font-medium text-white transition hover:bg-[#0B8A79]"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}