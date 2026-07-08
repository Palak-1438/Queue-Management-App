"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createQueue(name: string) {
  try {
    const queue = await prisma.queue.create({
      data: { name },
    });
    revalidatePath("/queues");
    return { success: true, queue };
  } catch (error) {
    return { success: false, error: "Failed to create queue" };
  }
}

export async function deleteQueue(id: string) {
  try {
    await prisma.queue.delete({
      where: { id },
    });
    revalidatePath("/queues");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete queue" };
  }
}
