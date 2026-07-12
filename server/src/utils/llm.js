// This handles all the GPT-4 API calls
import OpenAI from "openai";

let openaiClient = null;

/**
 * Creates the OpenAI client when we first need it
 * No point initializing it if we don't have an API key
 */
function getOpenAIClient() {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

/**
 * Sends a prompt to GPT-4 and gets back the response
 * Falls back to mock responses if the API key isn't configured
 * Using gpt-4o-mini by default since it's fast and cheap
 */
export async function callOpenAI(prompt, options = {}) {
  const client = getOpenAIClient();
  
  if (!client) {
    console.warn("OpenAI API key not configured, returning mock response");
    return generateMockResponse(prompt, options);
  }

  try {
    const completion = await client.chat.completions.create({
      model: options.model || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: options.systemPrompt || "You are a helpful assistant that processes voice notes into structured content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    // If it's an auth error (401), fall back to mock response instead of crashing
    if (error.status === 401 || error.message.includes("API key")) {
      console.warn("Invalid API key, falling back to mock response");
      return generateMockResponse(prompt, options);
    }
    throw new Error(`LLM processing failed: ${error.message}`);
  }
}

/**
 * Generate realistic demo responses when API key is not configured
 */
function generateMockResponse(prompt, options = {}) {
  const system = (options.systemPrompt || "").toLowerCase();
  const text = extractUserPrompt(prompt);

  if (system.includes("daily planner")) {
    return JSON.stringify({
      title: "Daily Plan",
      schedule: [
        { time: "9:00 AM", activity: "Review priorities and inbox", duration: "30 min" },
        { time: "10:00 AM", activity: extractActivity(text, "Morning focus work"), duration: "2 hours" },
        { time: "1:00 PM", activity: "Lunch break", duration: "1 hour" },
        { time: "2:30 PM", activity: extractActivity(text, "Team collaboration"), duration: "1.5 hours" },
        { time: "4:30 PM", activity: "Wrap up and plan tomorrow", duration: "30 min" },
      ],
      priorities: extractPriorities(text),
      notes: `Generated from: "${truncate(text, 120)}"`,
    });
  }

  if (system.includes("project")) {
    return JSON.stringify({
      title: extractTitle(text, "Project Workflow"),
      description: `Project plan based on your voice note.`,
      phases: [
        { name: "Discovery", tasks: ["Gather requirements", "Identify stakeholders"], deadline: "Week 1" },
        { name: "Execution", tasks: extractTasks(text, 3), deadline: "Week 2-3" },
        { name: "Delivery", tasks: ["Review deliverables", "Deploy and document"], deadline: "Week 4" },
      ],
      milestones: ["Requirements signed off", "MVP complete", "Launch ready"],
      nextSteps: ["Assign owners to each phase", "Schedule kickoff meeting"],
    });
  }

  if (system.includes("json array") || system.includes("action items")) {
    return JSON.stringify(extractTasks(text, 4).map((task, i) => ({
      task,
      priority: i === 0 ? "high" : "medium",
      due_date: null,
    })));
  }

  if (system.includes("meeting")) {
    return [
      "Meeting Summary",
      "───────────────",
      `Topic: ${extractTitle(text, "Team Sync")}`,
      "",
      "Key Decisions:",
      "• Proceed with the proposed timeline",
      "• Assign action items to team leads",
      "",
      "Action Items:",
      ...extractTasks(text, 4).map((t) => `• ${t}`),
      "",
      "Follow-up: Schedule next check-in within one week",
    ].join("\n");
  }

  if (system.includes("email")) {
    const subject = extractTitle(text, "Follow-up");
    return [
      `Subject: ${subject}`,
      "",
      "Hi team,",
      "",
      `Following up on our discussion: ${truncate(text, 200)}`,
      "",
      "Please let me know if you have any questions or need clarification.",
      "",
      "Best regards,",
      "Vocentra User",
    ].join("\n");
  }

  if (system.includes("blog")) {
    const title = extractTitle(text, "Insights from Your Voice Note");
    return `# ${title}\n\n${truncate(text, 400)}\n\n## Key Takeaways\n\n- Voice-driven productivity saves time\n- Structured workflows improve execution\n- AI helps turn ideas into action`;
  }

  const meetingMatch = text.match(/meeting|schedule|calendar/i);
  const hasTime = text.match(/\d{1,2}\s*(?::\d{2})?\s*(?:am|pm)/i);

  return JSON.stringify({
    title: extractTitle(text, "Generated Workflow"),
    summary: `Structured workflow from your command: "${truncate(text, 150)}"`,
    meeting: meetingMatch ? {
      title: extractTitle(text, "Team Meeting"),
      date: text.match(/tomorrow/i) ? "Tomorrow" : "This week",
      time: hasTime ? hasTime[0] : "4:00 PM",
    } : null,
    tasks: extractTasks(text, 4).map((task) => ({ task, status: "pending", priority: "medium" })),
    reminders: text.match(/remind|slack|notify/i) ? ["Send team notification", "Set calendar reminder"] : [],
  });
}

function extractUserPrompt(prompt) {
  const markers = [
    /Voice command:\s*([\s\S]+)$/i,
    /Voice note:\s*([\s\S]+)$/i,
    /Voice input:\s*([\s\S]+)$/i,
  ];

  for (const marker of markers) {
    const match = prompt.match(marker);
    if (match?.[1]) return match[1].trim();
  }

  return prompt.trim();
}

function truncate(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

function extractTitle(text, fallback) {
  const cleaned = text.replace(/^(please|can you|i need to|schedule|create)\s+/i, "").trim();
  if (!cleaned) return fallback;
  const sentence = cleaned.split(/[.!?]/)[0].trim();
  return sentence.length > 60 ? `${sentence.slice(0, 57)}...` : sentence || fallback;
}

function extractActivity(text, fallback) {
  const verbs = text.match(/(?:work on|finish|complete|review|prepare)\s+[^.!?]+/i);
  return verbs ? verbs[0] : fallback;
}

function extractPriorities(text) {
  const items = extractTasks(text, 3);
  return items.length ? items : ["Complete top priority task", "Follow up on pending items", "Plan tomorrow"];
}

function extractTasks(text, count) {
  const tasks = [];
  const patterns = [
    /(?:and|then|also)\s+([^.!?]+)/gi,
    /(?:remind|notify|send|create|schedule)\s+([^.!?]+)/gi,
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const task = match[1]?.trim();
      if (task && task.length > 5 && !tasks.includes(task)) tasks.push(task);
    }
  }

  if (tasks.length === 0) {
    const chunks = text.split(/,| and /i).map((s) => s.trim()).filter((s) => s.length > 8);
    tasks.push(...chunks.slice(0, count));
  }

  while (tasks.length < count) {
    const defaults = [
      "Review and confirm details",
      "Notify relevant stakeholders",
      "Set follow-up reminder",
      "Document outcomes",
    ];
    tasks.push(defaults[tasks.length]);
  }

  return tasks.slice(0, count);
}

/**
 * Check if LLM is configured
 */
export function isLLMConfigured() {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Parse JSON from LLM response (handles markdown code blocks)
 */
export function parseJSONFromLLM(text) {
  try {
    // Try direct parse first
    return JSON.parse(text);
  } catch {
    // Extract from markdown code block
    const match = text.match(/```(?:json)?\s*(\[[\s\S]*?\]|\{[\s\S]*?\})\s*```/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch {
        return null;
      }
    }
    return null;
  }
}
