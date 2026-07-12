import { applyTemplate, TEMPLATES } from "../utils/templates.js";
import { callOpenAI, parseJSONFromLLM } from "../utils/llm.js";

export async function workflowGeneric(prompt, noteId) {
  const enrichedPrompt = applyTemplate(TEMPLATES.vocentraWorkflow, { PROMPT: prompt });

  const llmResponse = await callOpenAI(enrichedPrompt, {
    systemPrompt: "You are Vocentra, an AI workflow assistant. Convert voice commands into structured, actionable workflows. Return only valid JSON.",
    temperature: 0.5,
    maxTokens: 2000,
  });

  let parsed = parseJSONFromLLM(llmResponse);

  if (!parsed || typeof parsed !== "object") {
    parsed = {
      title: "Generated Workflow",
      summary: llmResponse.slice(0, 500),
      tasks: llmResponse.split("\n").filter((l) => l.trim()).slice(0, 5).map((line) => ({
        task: line.replace(/^[-•*✔✅]\s*/, "").trim(),
        status: "pending",
      })),
    };
  }

  return { noteId, workflowType: "generic", title: parsed.title, ...parsed };
}

export async function workflowDailyPlanner(prompt, noteId) {
  const enrichedPrompt = applyTemplate(TEMPLATES.dailyPlanner, { PROMPT: prompt });

  const llmResponse = await callOpenAI(enrichedPrompt, {
    systemPrompt: "Create a structured daily planner from voice input. Return valid JSON with title, schedule (array of time blocks), and priorities.",
    temperature: 0.5,
  });

  const parsed = parseJSONFromLLM(llmResponse) || {
    title: "Daily Plan",
    schedule: [{ time: "Morning", activity: llmResponse.slice(0, 200) }],
    priorities: ["Review and adjust plan"],
  };

  return { noteId, workflowType: "daily_planner", ...parsed };
}

export async function workflowProjectWorkflow(prompt, noteId) {
  const enrichedPrompt = applyTemplate(TEMPLATES.projectWorkflow, { PROMPT: prompt });

  const llmResponse = await callOpenAI(enrichedPrompt, {
    systemPrompt: "Break down project voice notes into phases, milestones, and action items. Return valid JSON.",
    temperature: 0.5,
  });

  const parsed = parseJSONFromLLM(llmResponse) || {
    title: "Project Workflow",
    phases: [{ name: "Phase 1", tasks: [llmResponse.slice(0, 200)] }],
  };

  return { noteId, workflowType: "project_workflow", ...parsed };
}
