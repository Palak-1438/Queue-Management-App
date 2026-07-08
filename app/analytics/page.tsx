import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import AnalyticsCards from "@/components/dashboard/AnalyticsCards";
import Charts from "@/components/dashboard/Charts";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const activeQueues = await prisma.queue.count();
  const totalTokens = await prisma.token.count();
  const completedTokens = await prisma.token.count({ where: { status: "Completed" } });
  const cancelledTokens = await prisma.token.count({ where: { status: "Cancelled" } });
  const peopleWaiting = await prisma.token.count({ where: { status: "Waiting" } });
  const servingTokens = await prisma.token.count({ where: { status: "Serving" } });

  const completed = await prisma.token.findMany({
    where: { status: "Completed", completedAt: { not: null } },
    select: { createdAt: true, completedAt: true },
  });

  let totalWaitTime = 0;
  completed.forEach((token) => {
    if (token.completedAt) {
      totalWaitTime += token.completedAt.getTime() - token.createdAt.getTime();
    }
  });

  const avgWaitTimeMs = completed.length > 0 ? totalWaitTime / completed.length : 0;
  const avgWaitTimeMins = Math.round(avgWaitTimeMs / 60000);

  const stats = {
    activeQueues,
    peopleWaiting,
    avgWaitTime: `${avgWaitTimeMins} min`,
    completedToday: completedTokens,
    cancelledToday: cancelledTokens,
  };

  const tokenStatusData = [
    { name: "Waiting", value: peopleWaiting },
    { name: "Serving", value: servingTokens },
    { name: "Completed", value: completedTokens },
    { name: "Cancelled", value: cancelledTokens },
  ].filter((item) => item.value > 0);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNavbar />

      <main className="md:pl-64 pt-6 px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Monitor queue performance and status trends across your system.
            </p>
          </div>

          <AnalyticsCards stats={stats} />
          <Charts tokenStatusData={tokenStatusData.length ? tokenStatusData : [{ name: "No Data", value: 1 }]} />
        </div>
      </main>
    </div>
  );
}
