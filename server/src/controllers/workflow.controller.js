import * as workflowService from "../services/workflow.service.js";
import { generateWorkflowSchema, listWorkflowsSchema } from "../validators/workflow.validator.js";

export async function generate(req, res, next) {
  try {
    const parsed = generateWorkflowSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: "error", message: "Invalid input", details: parsed.error.issues });
    }

    const workflow = await workflowService.generateWorkflow(req.user.id, parsed.data);
    res.status(201).json({ status: "success", workflow });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const parsed = listWorkflowsSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ status: "error", message: "Invalid query", details: parsed.error.issues });
    }

    const data = await workflowService.listWorkflows(req.user.id, parsed.data);
    res.json({ status: "success", ...data });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const workflow = await workflowService.getWorkflow(req.user.id, req.params.id);
    res.json({ status: "success", workflow });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await workflowService.deleteWorkflow(req.user.id, req.params.id);
    res.json({ status: "success", ...result });
  } catch (err) {
    next(err);
  }
}

export async function analytics(req, res, next) {
  try {
    const data = await workflowService.getAnalytics(req.user.id);
    res.json({ status: "success", analytics: data });
  } catch (err) {
    next(err);
  }
}
