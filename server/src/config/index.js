export const config = {
  port: Number(process.env.PORT || 3001),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  rateLimitPerMin: Number(process.env.RATE_LIMIT_PER_MIN || 60),
  openaiApiKey: process.env.OPENAI_API_KEY || "",
};
