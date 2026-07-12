import * as transcribeService from "../services/transcribe.service.js";

export async function transcribe(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "No audio file uploaded" });
    }

    const text = await transcribeService.transcribeAudio(req.file.buffer, req.file.originalname);
    res.json({ status: "success", transcript: text });
  } catch (err) {
    next(err);
  }
}
