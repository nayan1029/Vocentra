import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import VoiceRecorder from "../components/dashboard/VoiceRecorder";
import WorkflowOutput from "../components/dashboard/WorkflowOutput";
import HistoryPanel from "../components/dashboard/HistoryPanel";
import AnalyticsCard from "../components/dashboard/AnalyticsCard";
import { useAuth } from "../context/AuthContext";
import * as workflowService from "../services/workflows";

const WORKFLOW_TYPES = [
  { value: "generic", label: "Smart Workflow" },
  { value: "task_extraction", label: "Task Extraction" },
  { value: "meeting_notes", label: "Meeting Notes" },
  { value: "email_draft", label: "Email Draft" },
  { value: "daily_planner", label: "Daily Planner" },
  { value: "project_workflow", label: "Project Workflow" },
];

function DashboardContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");
  const [workflowType, setWorkflowType] = useState("generic");
  const [generating, setGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const { data: historyData } = useQuery({
    queryKey: ["workflows", search],
    queryFn: () => workflowService.listWorkflows({ search: search || undefined }),
  });

  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: workflowService.getAnalytics,
  });

  const workflows = historyData?.workflows || [];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter or record a command first");
      return;
    }

    setError("");
    setGenerating(true);
    try {
      const workflow = await workflowService.generateWorkflow({ prompt: prompt.trim(), workflowType });
      setCurrentResult(workflow);
      setSelectedId(workflow.id);
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate workflow");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelect = useCallback((w) => {
    setSelectedId(w.id);
    setCurrentResult(w);
    setPrompt(w.prompt);
    setWorkflowType(w.workflowType);
  }, []);

  const handleDelete = async (id) => {
    try {
      await workflowService.deleteWorkflow(id);
      if (selectedId === id) {
        setCurrentResult(null);
        setSelectedId(null);
      }
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    } catch {
      setError("Failed to delete workflow");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["workflows", search] });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, queryClient]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-[var(--text-muted)] mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="mb-8">
        <AnalyticsCard analytics={analytics} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-xl font-semibold mb-6">Create Workflow</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Workflow Type</label>
              <select
                value={workflowType}
                onChange={(e) => setWorkflowType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {WORKFLOW_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <VoiceRecorder value={prompt} onTranscriptChange={setPrompt} />

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="mt-6 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Workflow"}
            </button>
          </div>

          {currentResult && (
            <WorkflowOutput
              result={currentResult.result}
              workflowType={currentResult.workflowType}
            />
          )}
        </div>

        <div className="lg:col-span-1 min-h-[400px]">
          <HistoryPanel
            workflows={workflows}
            selectedId={selectedId}
            onSelect={handleSelect}
            onDelete={handleDelete}
            search={search}
            onSearchChange={setSearch}
          />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default Dashboard;
