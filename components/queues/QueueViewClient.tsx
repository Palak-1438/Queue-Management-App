"use client";

import { useState } from "react";
import { assignTopToken, completeService, cancelToken, reorderTokens, moveTokenToTop, moveTokenToBottom } from "@/actions/queueActions";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Filter, Play, CheckCircle2, XCircle, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Loader2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { AddPersonModal } from "./AddPersonModal";

export default function QueueViewClient({ queue }: { queue: any }) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // Use props directly for Server Components data binding
  const tokens = queue.tokens;

  const [actingTokenId, setActingTokenId] = useState<string | null>(null);

  const handleAssignTopToken = async () => {
    setIsAssigning(true);
    const result = await assignTopToken(queue.id);
    setIsAssigning(false);
    if (result.success) {
      toast({ title: "Success", description: "Next person is being served!" });
    } else {
      toast({ title: "Error", description: result.error || "Failed to assign token", variant: "destructive" });
    }
  };

  const handleCompleteService = async (tokenId: string) => {
    setActingTokenId(tokenId);
    const result = await completeService(queue.id, tokenId);
    setActingTokenId(null);
    if (result.success) {
      toast({ title: "Completed", description: "Service marked as completed." });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleMoveExtreme = async (tokenId: string, position: "TOP" | "BOTTOM") => {
    setActingTokenId(tokenId);
    const action = position === "TOP" ? moveTokenToTop : moveTokenToBottom;
    const result = await action(queue.id, tokenId);
    setActingTokenId(null);
    if (!result.success) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleCancelToken = async (tokenId: string) => {
    if (confirm("Are you sure you want to cancel this token?")) {
      setActingTokenId(tokenId);
      const result = await cancelToken(queue.id, tokenId);
      setActingTokenId(null);
      if (result.success) {
        toast({ title: "Cancelled", description: "Token has been cancelled." });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    }
  };

  const handleReorder = async (tokenId: string, direction: "UP" | "DOWN") => {
    setActingTokenId(tokenId);
    const result = await reorderTokens(queue.id, tokenId, direction);
    setActingTokenId(null);
    if (!result.success && result.error !== "Cannot move further") {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const filteredTokens = tokens.filter((token: any) => {
    const matchesSearch = token.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          token.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || token.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Waiting": return <span className="px-2.5 py-1 text-xs font-medium bg-violet-500/10 text-violet-500 rounded-full">Waiting</span>;
      case "Serving": return <span className="px-2.5 py-1 text-xs font-medium bg-amber-500/10 text-amber-500 rounded-full flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> Serving</span>;
      case "Completed": return <span className="px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-500 rounded-full">Completed</span>;
      case "Cancelled": return <span className="px-2.5 py-1 text-xs font-medium bg-rose-500/10 text-rose-500 rounded-full">Cancelled</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{queue.name}</h1>
          <p className="text-muted-foreground mt-1">Manage people and tokens in this queue.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAssignTopToken}
            disabled={isAssigning}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            {isAssigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            Serve Next
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Person
          </button>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tokens or names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 flex-1 sm:flex-none"
            >
              <option value="All">All Status</option>
              <option value="Waiting">Waiting</option>
              <option value="Serving">Serving</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">Token</th>
                <th className="px-6 py-4 font-medium">Person Info</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Wait Time</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTokens.map((token: any, index: number) => (
                  <motion.tr
                    key={token.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-base bg-secondary px-2 py-1 rounded-md">{token.tokenNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{token.personName}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">{token.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(token.status)}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {token.status === "Completed" || token.status === "Cancelled"
                        ? (token.completedAt ? format(new Date(token.completedAt), "HH:mm") : "-")
                        : formatDistanceToNow(new Date(token.createdAt))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {token.status === "Waiting" && (
                          <>
                            <button
                              onClick={() => handleMoveExtreme(token.id, "TOP")}
                              disabled={actingTokenId === token.id || index === 0}
                              className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                              title="Move to Top"
                            >
                              <ChevronsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReorder(token.id, "UP")}
                              disabled={actingTokenId === token.id || index === 0}
                              className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                              title="Move Up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReorder(token.id, "DOWN")}
                              disabled={actingTokenId === token.id || index === filteredTokens.length - 1}
                              className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                              title="Move Down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMoveExtreme(token.id, "BOTTOM")}
                              disabled={actingTokenId === token.id || index === filteredTokens.length - 1}
                              className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                              title="Move to Bottom"
                            >
                              <ChevronsDown className="w-4 h-4" />
                            </button>
                            <div className="w-px h-4 bg-border mx-1" />
                            <button
                              onClick={() => handleCancelToken(token.id)}
                              disabled={actingTokenId === token.id}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors disabled:opacity-50"
                              title="Cancel"
                            >
                              {actingTokenId === token.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            </button>
                          </>
                        )}
                        {token.status === "Serving" && (
                          <button
                            onClick={() => handleCompleteService(token.id)}
                            disabled={actingTokenId === token.id}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors disabled:opacity-50"
                            title="Complete Service"
                          >
                            {actingTokenId === token.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredTokens.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No tokens found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        queueId={queue.id}
      />
    </div>
  );
}
