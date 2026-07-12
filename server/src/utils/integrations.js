// These are helper functions for connecting to external services like WordPress and Notion

/**
 * WordPress REST API integration
 * @param {string} siteUrl - WordPress site URL
 * @param {string} token - WordPress application password or JWT
 * @param {Object} post - Post data { title, content, status }
 */
export async function createWordPressPost(siteUrl, token, post) {
  const url = `${siteUrl}/wp-json/wp/v2/posts`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: post.title,
      content: post.content,
      status: post.status || "draft",
    }),
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Notion API integration - Create a page in a database
 * @param {string} token - Notion integration token
 * @param {string} databaseId - Target database ID
 * @param {Object} properties - Page properties
 */
export async function createNotionPage(token, databaseId, properties) {
  const url = "https://api.notion.com/v1/pages";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [{ text: { content: properties.title } }],
        },
        Status: {
          select: { name: properties.status || "Not Started" },
        },
        ...(properties.description && {
          Description: {
            rich_text: [{ text: { content: properties.description } }],
          },
        }),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Asana API integration - Create a task
 * @param {string} token - Asana personal access token
 * @param {string} workspaceId - Workspace GID
 * @param {Object} task - Task data { name, notes, due_on }
 */
export async function createAsanaTask(token, workspaceId, task) {
  const url = "https://app.asana.com/api/1.0/tasks";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        workspace: workspaceId,
        name: task.name,
        notes: task.notes || "",
        ...(task.due_on && { due_on: task.due_on }),
        ...(task.projects && { projects: task.projects }),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Asana API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Send webhook notification
 * @param {string} webhookUrl - Webhook endpoint
 * @param {Object} payload - Data to send
 */
export async function sendWebhook(webhookUrl, payload) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
  }

  return response.status === 204 ? null : response.json();
}

/**
 * Simple retry wrapper with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      console.warn(`Retry ${i + 1}/${maxRetries} after ${delay}ms:`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
