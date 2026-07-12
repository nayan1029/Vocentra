import OpenAI from "openai";
import { createReadStream } from "fs";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

let openaiClient = null;

function getOpenAIClient() {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export async function transcribeAudio(buffer, originalName = "audio.webm") {
  const client = getOpenAIClient();
  if (!client) {
    const err = new Error("Audio transcription requires OPENAI_API_KEY in .env");
    err.status = 503;
    throw err;
  }

  const ext = originalName.includes(".") ? originalName.slice(originalName.lastIndexOf(".")) : ".webm";
  const tempPath = join(tmpdir(), `vocentra-${Date.now()}${ext}`);

  try {
    await writeFile(tempPath, buffer);
    const transcription = await client.audio.transcriptions.create({
      file: createReadStream(tempPath),
      model: "whisper-1",
    });
    return transcription.text?.trim() || "";
  } finally {
    await unlink(tempPath).catch(() => {});
  }
}
