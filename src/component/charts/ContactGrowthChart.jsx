import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { COLORS, gridProps, axisProps, tooltipProps, dateAxisInterval, shortDate } from "./chartTheme";

export default function ContactGrowthChart({ series = [], days = 30 }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={series} margin={{ top: 4, right: 8, left: -18, bottom: 4 }}>
        <CartesianGrid {...gridProps} />
        <XAxis
          dataKey="date"
          {...axisProps}
          tickFormatter={shortDate}
          interval={dateAxisInterval(days)}
          minTickGap={12}
        />
        {/* Two scales: daily signups are small numbers, the cumulative total is
            large. One shared axis would flatten the bars into invisibility. */}
        <YAxis yAxisId="left" {...axisProps} allowDecimals={false} width={44} />
        <YAxis yAxisId="right" orientation="right" {...axisProps} allowDecimals={false} width={44} />
        <Tooltip {...tooltipProps} labelFormatter={shortDate} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />

        <Bar
          yAxisId="left" dataKey="newContacts" name="New contacts"
          fill={COLORS.accent} radius={[4, 4, 0, 0]} maxBarSize={26}
        />
        <Line
          yAxisId="right" type="monotone" dataKey="cumulativeContacts" name="Total contacts"
          stroke={COLORS.primary} strokeWidth={2} dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
