import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import {
  MessageSquare, ArrowDownLeft, ArrowUpRight, CheckCheck,
  UserPlus, Users, Package, Target, AlertCircle, LayoutDashboard,
  TrendingUp, Send, Boxes, Tag,
} from "lucide-react";
import { getstatsoverview } from "../api/stats";
import StatCard from "../component/StatCard";
import DateRangePicker from "../component/DateRangePicker";
import ChartCard from "../component/charts/ChartCard";
import MessagesOverTimeChart from "../component/charts/MessagesOverTimeChart";
import DeliveryBreakdownChart from "../component/charts/DeliveryBreakdownChart";
import ContactGrowthChart from "../component/charts/ContactGrowthChart";
import HorizontalBarChart from "../component/charts/HorizontalBarChart";

const DAY_MS = 24 * 60 * 60 * 1000;
const toKey = (date) => date.toISOString().slice(0, 10);

const defaultRange = () => {
  const today = new Date(`${toKey(new Date())}T00:00:00.000Z`);
  return {
    from: toKey(new Date(today.getTime() - 29 * DAY_MS)),
    to: toKey(today),
  };
};

const nf = new Intl.NumberFormat();
const fmt = (n) => nf.format(n ?? 0);
// Rates are null when the denominator is zero — show a dash, never a
// misleading 0%.
const pct = (v) => (v === null || v === undefined ? "—" : `${(v * 100).toFixed(1)}%`);

const formatDay = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", timeZone: "UTC" });
};

export default function Dashboard() {
  const [range, setRange] = useState(defaultRange);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [rangeError, setRangeError] = useState(null);

  const abortRef = useRef(null);
  const isFirstLoad = useRef(true);

  const fetchStats = useCallback(async (from, to) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (isFirstLoad.current) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await getstatsoverview(from, to, controller.signal);
      setStats(res.data.stats);
      setError(null);
      setRangeError(null);
    } catch (err) {
      // An aborted request is a superseded one, not a failure — without this
      // every fast date change would render as an error.
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;

      const message = err.response?.data?.message || "Failed to load dashboard stats";

      // A 400 is a bad date range: keep the page and show it by the inputs
      // rather than replacing everything the operator was looking at.
      if (err.response?.status === 400) {
        setRangeError(message);
      } else {
        setError(message);
      }
      toast.error(message);
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
        setRefreshing(false);
        isFirstLoad.current = false;
      }
    }
  }, []);

  useEffect(() => {
    // Debounced so typing into a date input doesn't fire a request per keystroke.
    const timer = setTimeout(() => fetchStats(range.from, range.to), 300);
    return () => clearTimeout(timer);
  }, [range.from, range.to, fetchStats]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Every read below is guarded. This is the post-login landing page, so a
  // render-time throw here would look like the whole CRM is down.
  const messaging = stats?.messaging;
  const contacts = stats?.contacts;
  const catalog = stats?.catalog;
  const days = stats?.range?.days ?? 30;

  const msgSeries = messaging?.series ?? [];
  const hasMessages = (messaging?.totals?.total ?? 0) > 0;
  const contactSeries = contacts?.series ?? [];
  const byGroup = contacts?.byGroup ?? [];
  const topProducts = catalog?.topProducts ?? [];
  const topKeywords = catalog?.topKeywords ?? [];

  // Distinguishes "nothing happened in this range" from "tracking hasn't
  // started yet" — conflating them makes a new table look like a dead bot.
  const trackingStarted = !!catalog?.trackingSince;
  const catalogEmptyText = !catalog?.available
    ? "Catalog stats are unavailable right now."
    : !trackingStarted
      ? "Product match tracking begins after the next deploy."
      : "No product matches in this range.";

  const failureRate = messaging?.delivery?.failureRate ?? null;
  const highFailure = failureRate !== null && failureRate > 0.1;

  return (
    <div className="h-full w-full overflow-y-auto bg-[#EAF7F4] px-4 py-6 sm:px-8">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-[#1F2937]">
            <LayoutDashboard size={20} className="text-[#0EA894]" />
            Dashboard
          </h1>
          <p className="text-sm text-[#6B7280]">
            Messaging, contacts and catalog performance
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            {refreshing && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0EA894]/20 border-t-[#0EA894]" />
            )}
            <DateRangePicker
              from={range.from}
              to={range.to}
              onChange={setRange}
              disabled={loading}
            />
          </div>
          {rangeError && (
            <p className="text-xs text-[#DC2626]">{rangeError}</p>
          )}
        </div>
      </div>

      {error ? (
        // Full panel rather than only a toast: a toast disappears and leaves an
        // all-zeros dashboard that looks like real data. Layout and sidebar stay
        // intact so the inbox is still one click away.
        <div className="rounded-2xl border border-[#FEE2E2] bg-white p-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2]">
            <AlertCircle size={24} className="text-[#DC2626]" />
          </div>
          <h2 className="mt-3 text-base font-semibold text-[#1F2937]">
            Couldn't load the dashboard
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">{error}</p>
          <button
            onClick={() => fetchStats(range.from, range.to)}
            className="mt-4 rounded-xl bg-[#0B6F60] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B8A79]"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className={refreshing ? "pointer-events-none opacity-60 transition-opacity" : "transition-opacity"}>
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            <StatCard
              loading={loading}
              icon={<MessageSquare size={17} />}
              label="Total Messages"
              value={fmt(messaging?.totals?.total)}
              sub={`${messaging?.totals?.avgPerDay ?? 0}/day avg`}
            />
            <StatCard
              loading={loading}
              icon={<ArrowDownLeft size={17} />}
              label="Incoming"
              value={fmt(messaging?.totals?.incoming)}
              sub={`${fmt(messaging?.totals?.activeContacts)} active contacts`}
            />
            <StatCard
              loading={loading}
              icon={<ArrowUpRight size={17} />}
              label="Outgoing"
              value={fmt(messaging?.totals?.outgoing)}
              sub={`${fmt(messaging?.totals?.outgoingByOrigin?.BOT)} by bot`}
            />
            <StatCard
              loading={loading}
              tone={highFailure ? "danger" : "default"}
              icon={highFailure ? <AlertCircle size={17} /> : <CheckCheck size={17} />}
              label="Delivery Rate"
              value={pct(messaging?.delivery?.deliveredRate)}
              sub={`${pct(failureRate)} failed`}
            />
            <StatCard
              loading={loading}
              icon={<UserPlus size={17} />}
              label="New Contacts"
              value={fmt(contacts?.totals?.newContacts)}
              sub={`${fmt(contacts?.totals?.newGroups)} new groups`}
            />
            <StatCard
              loading={loading}
              icon={<Users size={17} />}
              label="Total Contacts"
              value={fmt(contacts?.totals?.totalContacts)}
              sub={`${fmt(contacts?.totals?.totalGroups)} groups`}
            />
            <StatCard
              loading={loading}
              icon={<Package size={17} />}
              label="Product Matches"
              value={trackingStarted ? fmt(catalog?.totals?.productMatches) : "—"}
              sub={trackingStarted ? `${fmt(catalog?.totals?.uniqueProductsMatched)} products` : "not tracked yet"}
            />
            <StatCard
              loading={loading}
              icon={<Target size={17} />}
              label="Match Rate"
              value={trackingStarted ? pct(catalog?.totals?.matchRate) : "—"}
              sub="of incoming messages"
            />
          </div>

          {/* Charts */}
          {!loading && (
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <ChartCard
                className="xl:col-span-2"
                icon={<TrendingUp size={15} className="text-[#0EA894]" />}
                title="Messages over time"
                subtitle={`${days} days · UTC`}
                isEmpty={!hasMessages}
                emptyText="No messages in this range."
              >
                <MessagesOverTimeChart series={msgSeries} days={days} />
              </ChartCard>

              <ChartCard
                icon={<Send size={15} className="text-[#0EA894]" />}
                title="Delivery breakdown"
                // Status is overwritten by whatever the webhook last reported,
                // so this is a snapshot and can move backwards.
                subtitle="Current status of messages sent in this range"
                isEmpty={(messaging?.totals?.outgoing ?? 0) === 0}
                emptyText="No outgoing messages in this range."
              >
                <DeliveryBreakdownChart byStatus={messaging?.delivery?.byStatus} />
              </ChartCard>

              <ChartCard
                icon={<TrendingUp size={15} className="text-[#0EA894]" />}
                title="Contact growth"
                subtitle="New per day, with running total"
                isEmpty={contactSeries.length === 0}
                emptyText="No contact data in this range."
              >
                <ContactGrowthChart series={contactSeries} days={days} />
              </ChartCard>

              <ChartCard
                icon={<Users size={15} className="text-[#0EA894]" />}
                title="Contacts by group"
                subtitle="All contacts, including ungrouped"
                isEmpty={byGroup.length === 0}
                emptyText="No groups yet."
              >
                <HorizontalBarChart
                  data={byGroup}
                  labelKey="groupName"
                  valueKey="contactCount"
                  valueName="Contacts"
                />
              </ChartCard>

              <ChartCard
                icon={<Boxes size={15} className="text-[#0EA894]" />}
                title="Top products matched"
                subtitle={
                  trackingStarted
                    ? `Tracking since ${formatDay(catalog?.trackingSince)}`
                    : "Keyword matches that triggered a product reply"
                }
                isEmpty={topProducts.length === 0}
                emptyText={catalogEmptyText}
              >
                <HorizontalBarChart
                  data={topProducts}
                  labelKey="name"
                  valueKey="matches"
                  valueName="Matches"
                  color="#0B6F60"
                />
              </ChartCard>

              {/* A ranked list, not a chart: short text labels read better this
                  way and it costs no extra chart config. */}
              <ChartCard
                icon={<Tag size={15} className="text-[#0EA894]" />}
                title="Top keywords"
                subtitle="Which keywords customers actually used"
                isEmpty={topKeywords.length === 0}
                emptyText={catalogEmptyText}
              >
                <ol className="space-y-1.5">
                  {topKeywords.map((row, i) => {
                    const max = topKeywords[0]?.matches || 1;
                    const width = Math.max(4, Math.round((row.matches / max) * 100));
                    return (
                      <li key={`${row.keyword}-${i}`} className="relative overflow-hidden rounded-lg">
                        <div
                          className="absolute inset-y-0 left-0 rounded-lg bg-[#0EA894]/10"
                          style={{ width: `${width}%` }}
                        />
                        <div className="relative flex items-center justify-between px-3 py-1.5">
                          <span className="truncate text-sm text-[#1F2937]">{row.keyword || "(blank)"}</span>
                          <span className="ml-3 flex-none text-xs font-semibold tabular-nums text-[#0B6F60]">
                            {fmt(row.matches)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </ChartCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
