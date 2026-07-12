import { z } from "zod";

export const generateWorkflowSchema = z.object({
  prompt: z.string().min(1).max(10000),
  workflowType: z.enum([
    "generic",
    "task_extraction",
    "meeting_notes",
    "email_draft",
    "daily_planner",
    "project_workflow",
  ]).default("generic"),
});

export const listWorkflowsSchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});
