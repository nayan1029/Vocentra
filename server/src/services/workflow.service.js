import prisma from "../db/prisma.js";
import { routeWorkflow } from "../workflows/index.js";

function extractTitle(result, workflowType) {
  if (result.title) return result.title;
  if (result.email?.subject) return result.email.subject;
  if (result.summary) return result.summary.split("\n")[0].slice(0, 80);
  if (result.tasks?.[0]?.task) return result.tasks[0].task;
  return `${workflowType.replace(/_/g, " ")} workflow`;
}

export async function generateWorkflow(userId, { prompt, workflowType }) {
  const noteId = `voc-${Date.now()}`;
  const timestamp = new Date().toISOString();
  const result = await routeWorkflow(workflowType, prompt, noteId, timestamp);

  const workflow = await prisma.workflow.create({
    data: {
      userId,
      prompt,
      workflowType,
      result: JSON.stringify(result),
      title: extractTitle(result, workflowType),
    },
  });

  return { ...workflow, result: JSON.parse(workflow.result) };
}

export async function listWorkflows(userId, { search, limit, offset }) {
  const where = {
    userId,
    ...(search
      ? {
          OR: [
            { prompt: { contains: search } },
            { title: { contains: search } },
          ],
        }
      : {}),
  };

  const [workflows, total] = await Promise.all([
    prisma.workflow.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.workflow.count({ where }),
  ]);

  return {
    workflows: workflows.map((w) => ({ ...w, result: JSON.parse(w.result) })),
    total,
  };
}

export async function getWorkflow(userId, workflowId) {
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, userId },
  });

  if (!workflow) {
    const err = new Error("Workflow not found");
    err.status = 404;
    throw err;
  }

  return { ...workflow, result: JSON.parse(workflow.result) };
}

export async function deleteWorkflow(userId, workflowId) {
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, userId },
  });

  if (!workflow) {
    const err = new Error("Workflow not found");
    err.status = 404;
    throw err;
  }

  await prisma.workflow.delete({ where: { id: workflowId } });
  return { deleted: true };
}

export async function getAnalytics(userId) {
  const [total, byType, recent, user] = await Promise.all([
    prisma.workflow.count({ where: { userId } }),
    prisma.workflow.groupBy({
      by: ["workflowType"],
      where: { userId },
      _count: { workflowType: true },
    }),
    prisma.workflow.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 7,
      select: { createdAt: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true },
    }),
  ]);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const dailyCounts = last7Days.map((day) => ({
    date: day,
    count: recent.filter((w) => w.createdAt.toISOString().startsWith(day)).length,
  }));

  const typeBreakdown = Object.fromEntries(
    byType.map((t) => [t.workflowType, t._count.workflowType])
  );

  const daysSinceJoin = user
    ? Math.max(1, Math.ceil((Date.now() - user.createdAt.getTime()) / 86400000))
    : 1;

  return {
    totalWorkflows: total,
    typeBreakdown,
    dailyCounts,
    avgPerDay: Math.round((total / daysSinceJoin) * 10) / 10,
    mostUsedType: byType.sort((a, b) => b._count.workflowType - a._count.workflowType)[0]?.workflowType || null,
  };
}
