"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addPersonToQueue(queueId: string, personName: string, phone: string) {
  try {
    const queue = await prisma.queue.findUnique({
      where: { id: queueId },
      include: { tokens: true }
    });

    if (!queue) return { success: false, error: "Queue not found" };

    const tokenNumberStr = `T-${(queue.tokens.length + 1).toString().padStart(3, '0')}`;
    const nextPosition = queue.tokens.length + 1;

    const token = await prisma.token.create({
      data: {
        tokenNumber: tokenNumberStr,
        personName,
        phone,
        position: nextPosition,
        queueId,
        status: "Waiting",
      }
    });

    revalidatePath(`/queues/${queueId}`);
    return { success: true, token };
  } catch (error) {
    return { success: false, error: "Failed to add person" };
  }
}

export async function assignTopToken(queueId: string) {
  try {
    const topToken = await prisma.token.findFirst({
      where: { queueId, status: "Waiting" },
      orderBy: { position: "asc" }
    });

    if (!topToken) return { success: false, error: "No waiting tokens found" };

    const token = await prisma.token.update({
      where: { id: topToken.id },
      data: {
        status: "Serving",
        calledAt: new Date(),
      }
    });

    revalidatePath(`/queues/${queueId}`);
    return { success: true, token };
  } catch (error) {
    return { success: false, error: "Failed to assign top token" };
  }
}

export async function completeService(queueId: string, tokenId: string) {
  try {
    const token = await prisma.token.update({
      where: { id: tokenId },
      data: {
        status: "Completed",
        completedAt: new Date(),
      }
    });

    revalidatePath(`/queues/${queueId}`);
    return { success: true, token };
  } catch (error) {
    return { success: false, error: "Failed to complete service" };
  }
}

export async function cancelToken(queueId: string, tokenId: string) {
  try {
    const token = await prisma.token.update({
      where: { id: tokenId },
      data: {
        status: "Cancelled",
        completedAt: new Date(),
      }
    });

    revalidatePath(`/queues/${queueId}`);
    return { success: true, token };
  } catch (error) {
    return { success: false, error: "Failed to cancel token" };
  }
}

export async function reorderTokens(queueId: string, tokenId: string, direction: "UP" | "DOWN") {
  try {
    const queue = await prisma.queue.findUnique({
      where: { id: queueId },
      include: { tokens: { where: { status: "Waiting" }, orderBy: { position: "asc" } } }
    });

    if (!queue) return { success: false, error: "Queue not found" };

    const tokens = queue.tokens;
    const currentIndex = tokens.findIndex((t: any) => t.id === tokenId);

    if (currentIndex === -1) return { success: false, error: "Token not found in waiting list" };

    let targetIndex = -1;
    if (direction === "UP" && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === "DOWN" && currentIndex < tokens.length - 1) {
      targetIndex = currentIndex + 1;
    }

    if (targetIndex !== -1) {
      const currentToken = tokens[currentIndex];
      const targetToken = tokens[targetIndex];

      await prisma.$transaction([
        prisma.token.update({ where: { id: currentToken.id }, data: { position: targetToken.position } }),
        prisma.token.update({ where: { id: targetToken.id }, data: { position: currentToken.position } })
      ]);
      revalidatePath(`/queues/${queueId}`);
      return { success: true };
    }

    return { success: false, error: "Cannot move further" };
  } catch (error) {
    return { success: false, error: "Failed to reorder token" };
  }
}

export async function moveTokenToTop(queueId: string, tokenId: string) {
  try {
    const queue = await prisma.queue.findUnique({
      where: { id: queueId },
      include: { tokens: { where: { status: "Waiting" }, orderBy: { position: "asc" } } }
    });

    if (!queue || queue.tokens.length === 0) return { success: false, error: "Queue or tokens not found" };

    const topPosition = queue.tokens[0].position;
    const currentToken = queue.tokens.find((t: any) => t.id === tokenId);

    if (!currentToken || currentToken.position === topPosition) return { success: false, error: "Already at top or not found" };

    await prisma.token.update({
      where: { id: tokenId },
      data: { position: topPosition - 1 }
    });

    revalidatePath(`/queues/${queueId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to move to top" };
  }
}

export async function moveTokenToBottom(queueId: string, tokenId: string) {
  try {
    const queue = await prisma.queue.findUnique({
      where: { id: queueId },
      include: { tokens: { where: { status: "Waiting" }, orderBy: { position: "desc" } } }
    });

    if (!queue || queue.tokens.length === 0) return { success: false, error: "Queue or tokens not found" };

    const bottomPosition = queue.tokens[0].position;
    const currentToken = queue.tokens.find((t: any) => t.id === tokenId);

    if (!currentToken || currentToken.position === bottomPosition) return { success: false, error: "Already at bottom or not found" };

    await prisma.token.update({
      where: { id: tokenId },
      data: { position: bottomPosition + 1 }
    });

    revalidatePath(`/queues/${queueId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to move to bottom" };
  }
}
