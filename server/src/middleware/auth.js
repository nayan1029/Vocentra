import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

export function authenticate(req, res, next) {
  const auth = req.header("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ status: "error", message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ status: "error", message: "Invalid or expired token" });
  }
}
