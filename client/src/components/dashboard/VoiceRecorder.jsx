import { useRef, useState } from "react";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import * as workflowService from "../../services/workflows";

function VoiceRecorder({ onTranscriptChange, value }) {
  const { isListening, transcript, supported, start, stop, setTranscript } = useVoiceRecorder();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const displayText = value ?? transcript;

  const handleToggle = () => {
    if (isListening) {
      stop();
      onTranscriptChange?.(transcript);
    } else {
      start();
    }
  };

  const handleChange = (e) => {
    setTranscript(e.target.value);
    onTranscriptChange?.(e.target.value);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);
    try {
      const text = await workflowService.transcribeAudio(file);
      setTranscript(text);
      onTranscriptChange?.(text);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to transcribe audio. Use live recording or add OPENAI_API_KEY.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleToggle}
          disabled={!supported}
          className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all ${
            isListening
              ? "bg-red-500/20 border-2 border-red-500 animate-pulse"
              : "bg-violet-600 hover:bg-violet-500 border-2 border-violet-500"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="text-2xl">{isListening ? "⏹️" : "🎤"}</span>
          {isListening && (
            <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-50" />
          )}
        </button>

        <div className="flex-1">
          <p className="font-medium">
            {isListening ? "Listening..." : supported ? "Click to record" : "Voice not supported"}
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            {supported ? "Speak naturally — AI will understand your intent" : "Use the text input below instead"}
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/webm"
            onChange={handleFileUpload}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-sm font-medium cursor-pointer hover:border-violet-500 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          >
            📁 {uploading ? "Transcribing..." : "Upload Audio"}
          </label>
        </div>
      </div>

      {uploadError && (
        <p className="text-sm text-amber-400">{uploadError}</p>
      )}

      <textarea
        value={displayText}
        onChange={handleChange}
        placeholder="Type or speak your command... e.g. 'Schedule a meeting with the dev team tomorrow at 4 PM'"
        rows={4}
        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
      />
    </div>
  );
}

export default VoiceRecorder;
