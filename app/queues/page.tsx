import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { prisma } from "@/lib/prisma";
import { QueueCard } from "@/components/queues/QueueCard";
import { QueuesHeader } from "@/components/queues/QueuesHeader";
import { Users, Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function QueuesPage() {
  const queues = await prisma.queue.findMany({
    include: {
      tokens: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNavbar />

      <main className="md:pl-64 pt-6 px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <QueuesHeader />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {queues.map((queue: any) => {
              const waitingCount = queue.tokens.filter((t: any) => t.status === "Waiting").length;
              const servingCount = queue.tokens.filter((t: any) => t.status === "Serving").length;

              return (
                <QueueCard key={queue.id} queue={queue} waitingCount={waitingCount} servingCount={servingCount} />
              );
            })}

            {queues.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border border-dashed rounded-xl bg-card/50">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No queues found</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">Get started by creating your first queue to manage your visitors.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
