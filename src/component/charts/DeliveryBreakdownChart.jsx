import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import { gridProps, axisProps, tooltipProps } from "./chartTheme";

// Only the statuses an outgoing message can meaningfully reach, in funnel
// order. The rest of the enum applies to inbound rows and would just add
// permanently-zero bars.
const STATUS_ORDER = ["PENDING", "SENT", "DELIVERED", "READ", "FAILED"];

const STATUS_COLOR = {
  PENDING: "#9CA3AF",
  SENT: "#5EC7B7",
  DELIVERED: "#0EA894",
  READ: "#0B6F60",
  FAILED: "#DC2626",
};

export default function DeliveryBreakdownChart({ byStatus = {} }) {
  const data = STATUS_ORDER.map((status) => ({
    status,
    count: byStatus?.[status] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={224}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 12, bottom: 0 }}>
        <CartesianGrid {...gridProps} horizontal={false} vertical />
        <XAxis type="number" {...axisProps} allowDecimals={false} />
        <YAxis type="category" dataKey="status" {...axisProps} width={78} />
        <Tooltip {...tooltipProps} />
        <Bar dataKey="count" name="Messages" radius={[0, 6, 6, 0]} barSize={18}>
          {data.map((row) => (
            <Cell key={row.status} fill={STATUS_COLOR[row.status]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
