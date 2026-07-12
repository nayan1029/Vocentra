import * as authService from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

export async function register(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: "error", message: "Invalid input", details: parsed.error.issues });
    }

    const data = await authService.registerUser(parsed.data);
    res.status(201).json({ status: "success", ...data });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: "error", message: "Invalid input", details: parsed.error.issues });
    }

    const data = await authService.loginUser(parsed.data);
    res.json({ status: "success", ...data });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.user.id);
    res.json({ status: "success", user });
  } catch (err) {
    next(err);
  }
}
