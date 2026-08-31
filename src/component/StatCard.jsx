// KPI tile. `tone` switches the icon chip to the app's error palette so a bad
// delivery/failure number reads at a glance without a separate component.
export default function StatCard({ icon, label, value, sub, tone = "default", loading = false }) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
        <div className="h-9 w-9 rounded-xl bg-[#E5E7EB]" />
        <div className="mt-3 h-3 w-20 rounded bg-[#E5E7EB]" />
        <div className="mt-2 h-7 w-16 rounded bg-[#E5E7EB]" />
      </div>
    );
  }

  const chip =
    tone === "danger"
      ? "bg-[#FEE2E2] text-[#DC2626]"
      : "bg-[#0EA894]/10 text-[#0B6F60]";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${chip}`}>
        {icon}
      </div>
      <p className="mt-3 text-xs text-[#6B7280]">{label}</p>
      {/* tabular-nums keeps digits from jittering when the range changes */}
      <p className="mt-0.5 text-2xl font-semibold tabular-nums text-[#1F2937]">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[#9CA3AF]">{sub}</p>}
    </div>
  );
}
