"use client";

import { useState } from "react";
import { addPersonToQueue } from "@/actions/queueActions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

export function AddPersonModal({ isOpen, onClose, queueId }: { isOpen: boolean; onClose: () => void; queueId: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const result = await addPersonToQueue(queueId, name, phone);
    if (result.success) {
      toast({ title: "Success", description: "Person added to queue." });
      setName("");
      setPhone("");
      onClose();
    } else {
      toast({ title: "Error", description: result.error || "Failed to add", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card w-full max-w-md rounded-xl shadow-2xl overflow-hidden border"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add Person</h2>
          <button onClick={onClose} className="text-muted-foreground hover:bg-muted p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Person Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full border rounded-lg px-4 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 234 567 890"
              className="w-full border rounded-lg px-4 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg font-medium hover:bg-muted transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Generate Token
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
