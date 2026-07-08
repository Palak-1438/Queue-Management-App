"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateQueueModal } from "./CreateQueueModal";

export function QueuesHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Queues</h1>
          <p className="text-muted-foreground mt-1">Manage your service queues and active tokens.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Queue
        </button>
      </div>

      <CreateQueueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
