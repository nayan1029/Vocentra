import api from "./api";

export async function generateWorkflow({ prompt, workflowType }) {
  const { data } = await api.post("/workflows/generate", { prompt, workflowType });
  return data.workflow;
}

export async function listWorkflows({ search, limit = 20, offset = 0 } = {}) {
  const { data } = await api.get("/workflows", { params: { search, limit, offset } });
  return data;
}

export async function getWorkflow(id) {
  const { data } = await api.get(`/workflows/${id}`);
  return data.workflow;
}

export async function deleteWorkflow(id) {
  const { data } = await api.delete(`/workflows/${id}`);
  return data;
}

export async function getAnalytics() {
  const { data } = await api.get("/workflows/analytics");
  return data.analytics;
}

export async function transcribeAudio(file) {
  const formData = new FormData();
  formData.append("audio", file);
  const { data } = await api.post("/workflows/transcribe", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.transcript;
}
