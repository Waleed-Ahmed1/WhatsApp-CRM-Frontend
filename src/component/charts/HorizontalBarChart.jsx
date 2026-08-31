import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { COLORS, gridProps, axisProps, tooltipProps } from "./chartTheme";

// Shared by "Contacts by group" and "Top products matched" — same shape, only
// the keys and labels differ, so one component covers both.
export default function HorizontalBarChart({
  data = [],
  labelKey,
  valueKey,
  valueName,
  color = COLORS.accent,
  height = 224,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 12, bottom: 0 }}>
        <CartesianGrid {...gridProps} horizontal={false} vertical />
        <XAxis type="number" {...axisProps} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey={labelKey}
          {...axisProps}
          width={110}
          // Long product/group names would otherwise blow out the axis width.
          tickFormatter={(v) => (typeof v === "string" && v.length > 16 ? `${v.slice(0, 15)}…` : v)}
        />
        <Tooltip {...tooltipProps} />
        <Bar dataKey={valueKey} name={valueName} fill={color} radius={[0, 6, 6, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}
