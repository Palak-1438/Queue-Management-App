"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

interface ChartsProps {
  tokenStatusData: { name: string; value: number }[];
}

const COLORS = {
  Waiting: "#8b5cf6", // Violet
  Serving: "#f59e0b", // Amber
  Completed: "#10b981", // Emerald
  Cancelled: "#f43f5e", // Rose
  "No Data": "#cbd5e1"
};

// Dummy data for area chart
const trendData = [
  { time: "09:00", visitors: 4 },
  { time: "10:00", visitors: 12 },
  { time: "11:00", visitors: 25 },
  { time: "12:00", visitors: 30 },
  { time: "13:00", visitors: 18 },
  { time: "14:00", visitors: 28 },
  { time: "15:00", visitors: 45 },
  { time: "16:00", visitors: 35 },
  { time: "17:00", visitors: 15 },
];

export default function Charts({ tokenStatusData }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Area Chart: Queue Length Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-xl border bg-card shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-6">Hourly Visitors Trend</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" opacity={0.1} className="dark:opacity-30 dark:stroke-slate-600" />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                itemStyle={{ color: "#8b5cf6", fontWeight: "bold" }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pie Chart: Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-6 rounded-xl border bg-card shadow-sm flex flex-col"
      >
        <h3 className="text-lg font-semibold mb-6">Token Status Distribution</h3>
        <div className="h-72 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tokenStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {tokenStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS["No Data"]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
