import React from "react";
import { Tag } from "lucide-react";

export default function InputDialog({
  open,
  value,
  onChange,
  onSubmit,
  onClose,
  saving,
}) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl">
            <Tag size={20} className="text-[#000000]" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1F2937]">
              Add Category
            </h2>

            <p className="text-sm text-[#6B7280]">
              Enter a new category name
            </p>
          </div>
        </div>

        <input
          type="text"
          value={value}
          autoFocus
          placeholder="Category name"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim() && !saving) {
              onSubmit();
            }
          }}
          className="mb-6 w-full rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#1F2937] outline-none transition focus:border-[#0EA894] focus:ring-4 focus:ring-[#0EA894]/10"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#D1D5DB] px-5 py-2.5 text-sm font-medium text-[#6B7280] transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            disabled={!value.trim() || saving}
            onClick={onSubmit}
            className="rounded-xl bg-[#0B6F60] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B8A79] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}