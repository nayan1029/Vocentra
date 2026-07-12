import { Router } from "express";
import * as workflowController from "../controllers/workflow.controller.js";
import * as transcribeController from "../controllers/transcribe.controller.js";
import { authenticate } from "../middleware/auth.js";
import { audioUpload } from "../middleware/upload.js";

const router = Router();

router.use(authenticate);

router.post("/transcribe", audioUpload.single("audio"), transcribeController.transcribe);
router.post("/generate", workflowController.generate);
router.get("/", workflowController.list);
router.get("/analytics", workflowController.analytics);
router.get("/:id", workflowController.getOne);
router.delete("/:id", workflowController.remove);

export default router;
