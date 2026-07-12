// These are the actual workflow implementations
// Each one takes voice input and does something useful with it

import { createWordPressPost, createNotionPage, createAsanaTask, retryWithBackoff } from "../utils/integrations.js";
import { applyTemplate, TEMPLATES, extractDates } from "../utils/templates.js";
import { callOpenAI, parseJSONFromLLM } from "../utils/llm.js";
import { workflowGeneric, workflowDailyPlanner, workflowProjectWorkflow } from "./vocentra.js";

/**
 * Workflow: Voice note to WordPress blog post
 */
export async function workflowBlogPost(prompt, noteId) {
  // Apply template
  const enrichedPrompt = applyTemplate(TEMPLATES.blogPost, { PROMPT: prompt });
  
  // Call LLM to generate blog content
  const llmResponse = await callOpenAI(enrichedPrompt, {
    systemPrompt: "You are an expert content writer. Generate SEO-optimized blog posts. Return only the blog content without any markdown code blocks or formatting markers.",
    maxTokens: 2500,
  });
  
  // Clean up markdown code blocks and backticks
  let cleanedResponse = llmResponse
    .replace(/```[\s\S]*?```/g, '')  // Remove code blocks
    .replace(/```/g, '')              // Remove stray code fence markers
    .replace(/`/g, '')                // Remove backticks
    .trim();
  
  // Pull out the title from the first line (usually starts with #)
  const lines = cleanedResponse.split('\n').filter(l => l.trim());
  const title = lines[0].replace(/^#\s*/, '').replace(/<\/?[^>]+(>|$)/g, '').slice(0, 100);
  const content = cleanedResponse;
  
  const blogContent = { title, content };
  
  // Post to WordPress with retry
  if (process.env.WORDPRESS_URL && process.env.WORDPRESS_TOKEN) {
    const post = await retryWithBackoff(() =>
      createWordPressPost(
        process.env.WORDPRESS_URL,
        process.env.WORDPRESS_TOKEN,
        { ...blogContent, status: "draft" }
      )
    );
    console.log(`WordPress post created: ${post.id}`);
    return { noteId, workflowType: "blog_post", postId: post.id };
  }
  
  return { noteId, workflowType: "blog_post", result: blogContent };
}

/**
 * Workflow: Extract tasks and create in Notion
 */
export async function workflowTaskExtraction(prompt, noteId) {
  // Apply template for task extraction
  const enrichedPrompt = applyTemplate(TEMPLATES.taskList, { PROMPT: prompt });
  
  // Call LLM to extract tasks
  const llmResponse = await callOpenAI(enrichedPrompt, {
    systemPrompt: "Extract action items from voice notes and return only valid JSON array. Be precise and specific.",
    temperature: 0.5,
  });
  
  // Parse JSON response
  let tasks = parseJSONFromLLM(llmResponse);
  
  // Fallback if parsing fails
  if (!tasks || !Array.isArray(tasks)) {
    console.warn("Failed to parse tasks JSON, using fallback");
    tasks = [{ task: "Review voice note and extract tasks manually", priority: "medium", due_date: null }];
  }
  
  const results = [];
  if (process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID) {
    for (const task of tasks) {
      const page = await createNotionPage(
        process.env.NOTION_TOKEN,
        process.env.NOTION_DATABASE_ID,
        {
          title: task.task,
          status: "Not Started",
          description: `Priority: ${task.priority}${task.due_date ? `\nDue: ${task.due_date}` : ""}`,
        }
      );
      results.push(page.id);
      console.log(`Notion task created: ${page.id}`);
    }
  }
  
  return { noteId, workflowType: "task_extraction", taskCount: tasks.length, tasks, notionPages: results };
}

/**
 * Workflow: Meeting notes to Asana tasks
 */
export async function workflowMeetingNotes(prompt, noteId) {
  // Apply meeting notes template
  const enrichedPrompt = applyTemplate(TEMPLATES.meetingNotes, { PROMPT: prompt });
  
  // Call LLM for structured notes
  const structuredNotes = await callOpenAI(enrichedPrompt, {
    systemPrompt: "Summarize meeting notes into clear action items with owners and deadlines. Be concise and actionable.",
    maxTokens: 1500,
  });
  
  // Try to find any dates mentioned (deadlines, next meeting, etc.)
  const dates = extractDates(prompt);
  
  // Pull out the action items so they're easy to track
  const lines = structuredNotes.split('\n').filter(l => l.includes('-') || l.includes('•'));
  const actionItems = lines.slice(0, 5).map((line, i) => ({
    name: line.replace(/^[-•*]\s*/, '').slice(0, 100),
    notes: structuredNotes.slice(0, 200),
    due_on: dates[i] || null,
  }));
  
  // Fallback if no items extracted
  if (actionItems.length === 0) {
    actionItems.push({ name: "Review meeting notes", notes: structuredNotes.slice(0, 200), due_on: dates[0] || null });
  }
  
  const results = [];
  if (process.env.ASANA_TOKEN && process.env.ASANA_WORKSPACE_ID) {
    for (const item of actionItems) {
      const task = await createAsanaTask(
        process.env.ASANA_TOKEN,
        process.env.ASANA_WORKSPACE_ID,
        item
      );
      results.push(task.data.gid);
      console.log(`Asana task created: ${task.data.gid}`);
    }
  }
  
  return { noteId, workflowType: "meeting_notes", summary: structuredNotes, actionItems, asanaTasks: results };
}

/**
 * Workflow: Voice to email draft (save to file or send)
 */
export async function workflowEmailDraft(prompt, noteId) {
  const enrichedPrompt = applyTemplate(TEMPLATES.emailDraft, { PROMPT: prompt });
  
  // Call LLM to generate email
  const emailContent = await callOpenAI(enrichedPrompt, {
    systemPrompt: "Generate professional, well-structured emails. Include appropriate subject line, greeting, body, and closing.",
    maxTokens: 1000,
  });
  
  // Parse email components
  const subjectMatch = emailContent.match(/Subject:\s*(.+)/i);
  const subject = subjectMatch ? subjectMatch[1].trim() : "Follow-up";
  
  // Remove subject line from body if present
  const body = emailContent.replace(/Subject:\s*.+\n*/i, '').trim();
  
  const email = { subject, body };
  
  // Could integrate with SendGrid, Mailgun, etc.
  console.log("Email draft generated:", email.subject);
  
  return { noteId, workflowType: "email_draft", email };
}

/**
 * Workflow router - select workflow based on prompt or config
 */
export async function routeWorkflow(workflowType, prompt, noteId, timestamp) {
  switch (workflowType) {
    case "blog_post":
      return await workflowBlogPost(prompt, noteId);
    case "task_extraction":
      return await workflowTaskExtraction(prompt, noteId);
    case "meeting_notes":
      return await workflowMeetingNotes(prompt, noteId);
    case "email_draft":
      return await workflowEmailDraft(prompt, noteId);
    case "daily_planner":
      return await workflowDailyPlanner(prompt, noteId);
    case "project_workflow":
      return await workflowProjectWorkflow(prompt, noteId);
    case "generic":
      return await workflowGeneric(prompt, noteId);
    default:
      return await workflowGeneric(prompt, noteId);
  }
}
