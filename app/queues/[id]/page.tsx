import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QueueViewClient from "@/components/queues/QueueViewClient";

export const dynamic = 'force-dynamic';

export default async function SingleQueuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queue = await prisma.queue.findUnique({
    where: { id },
    include: {
      tokens: {
        orderBy: { position: "asc" }
      }
    }
  });

  if (!queue) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNavbar />
      <main className="md:pl-64 pt-6 px-4 md:px-8 pb-12">
        <QueueViewClient queue={queue} />
      </main>
    </div>
  );
}
