"use client";

import { motion } from "framer-motion";
import { Users, Clock, CheckCircle2, XCircle, ListTree } from "lucide-react";

interface AnalyticsCardsProps {
  stats: {
    activeQueues: number;
    peopleWaiting: number;
    avgWaitTime: string;
    completedToday: number;
    cancelledToday: number;
  };
}

export default function AnalyticsCards({ stats }: AnalyticsCardsProps) {
  const cards = [
    { title: "Active Queues", value: stats.activeQueues, icon: ListTree, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "People Waiting", value: stats.peopleWaiting, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Avg Wait Time", value: stats.avgWaitTime, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Completed Today", value: stats.completedToday, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Cancelled Today", value: stats.cancelledToday, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-transparent to-current opacity-5 group-hover:opacity-10 transition-opacity rounded-full pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
}
