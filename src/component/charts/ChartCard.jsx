// Shared shell for every dashboard panel. Matches the card treatment used on
// the settings page so the dashboard doesn't look bolted on.
export default function ChartCard({ icon, title, subtitle, isEmpty, emptyText, children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] ${className}`}>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1F2937]">
        {icon}
        {title}
      </h3>
      {subtitle && <p className="mt-0.5 text-xs text-[#6B7280]">{subtitle}</p>}

      <div className="mt-4">
        {isEmpty ? (
          <div className="flex h-56 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-[#6B7280]">{emptyText}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
