import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { COLORS, gridProps, axisProps, tooltipProps, dateAxisInterval, shortDate } from "./chartTheme";

export default function MessagesOverTimeChart({ series = [], days = 30 }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={series} margin={{ top: 4, right: 8, left: -18, bottom: 4 }}>
        <defs>
          <linearGradient id="fillIncoming" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.incoming} stopOpacity={0.35} />
            <stop offset="100%" stopColor={COLORS.incoming} stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillOutgoing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.outgoing} stopOpacity={0.35} />
            <stop offset="100%" stopColor={COLORS.outgoing} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid {...gridProps} />
        <XAxis
          dataKey="date"
          {...axisProps}
          tickFormatter={shortDate}
          interval={dateAxisInterval(days)}
          minTickGap={12}
        />
        <YAxis {...axisProps} allowDecimals={false} width={44} />
        <Tooltip {...tooltipProps} labelFormatter={shortDate} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />

        <Area
          type="monotone" dataKey="incoming" name="Incoming" stackId="1"
          stroke={COLORS.incoming} fill="url(#fillIncoming)" strokeWidth={2}
        />
        <Area
          type="monotone" dataKey="outgoing" name="Outgoing" stackId="1"
          stroke={COLORS.outgoing} fill="url(#fillOutgoing)" strokeWidth={2}
        />
        {/* Not stacked — failures are a subset of outgoing, so stacking them
            would double-count and overstate total volume. */}
        <Area
          type="monotone" dataKey="failed" name="Failed"
          stroke={COLORS.failed} fill="none" strokeWidth={1.5} strokeDasharray="4 3"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
