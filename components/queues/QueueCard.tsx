"use client";

import Link from "next/link";
import { Users, Clock, Trash2, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { deleteQueue } from "@/actions/getQueues";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function QueueCard({ queue, waitingCount, servingCount }: any) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to single queue view
    if (confirm("Are you sure you want to delete this queue?")) {
      setIsDeleting(true);
      const res = await deleteQueue(queue.id);
      setIsDeleting(false);
      if (res.success) {
        toast({ title: "Deleted", description: "Queue deleted successfully" });
      } else {
        toast({ title: "Error", description: res.error, variant: "destructive" });
      }
    }
  };

  return (
    <div className="group border bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold truncate pr-4">{queue.name}</h3>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-indigo-500" />
          <span>{waitingCount} people waiting</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </span>
          <span>{servingCount} currently serving</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span>Created {formatDistanceToNow(new Date(queue.createdAt))} ago</span>
        </div>
      </div>

      <Link
        href={`/queues/${queue.id}`}
        className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm mt-auto"
      >
        Open Queue
        <ArrowRight className="w-4 h-4" />
      </Link>

      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />
    </div>
  );
}
