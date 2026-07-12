// This file handles the prompt templates we send to GPT-4

/**
 * Apply template with variable substitution
 * @param {string} template - Template string with $VAR placeholders
 * @param {Object} variables - Key-value pairs for substitution
 * @returns {string} Processed template
 */
export function applyTemplate(template, variables) {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\$${key}`, "g"), value),
    template
  );
}

/**
 * Extract structured data from prompt using regex patterns
 * @param {string} text - Input text
 * @param {Object} patterns - Named regex patterns
 * @returns {Object} Extracted data
 */
export function extractData(text, patterns) {
  const extracted = {};
  
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    extracted[key] = match ? match[1] || match[0] : null;
  }
  
  return extracted;
}

/**
 * Common templates for voice-to-content workflows
 */
export const TEMPLATES = {
  blogPost: `Convert the following voice note into a 600–800 word SEO-friendly blog post. 
Include:
- Engaging title
- 2-3 H2 section headings
- Short paragraphs (2-3 sentences each)
- One bulleted list of key takeaways
- SEO meta description (max 150 chars)

Voice note: $PROMPT`,

  taskList: `Extract action items from this voice note and format as JSON array.
Each task should have: task (string), priority (high/medium/low), due_date (YYYY-MM-DD if mentioned).

Voice note: $PROMPT

Return only valid JSON array.`,

  meetingNotes: `Summarize this meeting voice note into structured notes:
- Key decisions made
- Action items with owners
- Important dates/deadlines
- Follow-up topics

Voice note: $PROMPT`,

  emailDraft: `Convert this voice note into a professional email:
- Clear subject line
- Proper greeting
- Well-structured body (3-4 paragraphs)
- Professional closing

Voice note: $PROMPT`,

  socialMedia: `Convert this voice note into engaging social media content:
- Twitter thread (3-5 tweets, 280 chars each)
- LinkedIn post (professional tone, 1-2 paragraphs)
- Include relevant hashtags

Voice note: $PROMPT`,

  vocentraWorkflow: `Convert this voice command into a structured workflow. Return JSON with:
- title (string): short descriptive title
- summary (string): 1-2 sentence overview
- meeting (object|null): { title, date, time } if scheduling mentioned
- tasks (array): [{ task, status: "pending"|"done", priority: "high"|"medium"|"low" }]
- reminders (array of strings, optional)

Voice command: $PROMPT

Return only valid JSON.`,

  dailyPlanner: `Create a daily planner from this voice input. Return JSON with:
- title (string)
- schedule (array): [{ time, activity, duration }]
- priorities (array of strings)
- notes (string, optional)

Voice input: $PROMPT

Return only valid JSON.`,

  projectWorkflow: `Break this project voice note into a workflow. Return JSON with:
- title (string)
- description (string)
- phases (array): [{ name, tasks: [string], deadline }]
- milestones (array of strings)
- nextSteps (array of strings)

Voice note: $PROMPT

Return only valid JSON.`,
};

/**
 * Parse JSON response safely with fallback
 * @param {string} text - Text that might contain JSON
 * @returns {Object|null} Parsed JSON or null
 */
export function safeJsonParse(text) {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\]|\{[\s\S]*?\})\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Input text
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Extract date mentions from text
 * @param {string} text - Input text
 * @returns {Array<string>} Array of ISO date strings
 */
export function extractDates(text) {
  const patterns = [
    /(\d{4}-\d{2}-\d{2})/g, // ISO format
    /(\d{1,2}\/\d{1,2}\/\d{4})/g, // US format
    /(today|tomorrow|next week)/gi, // Relative dates
  ];
  
  const dates = [];
  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      dates.push(match[0]);
    }
  }
  
  return dates;
}
