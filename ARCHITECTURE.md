# How Vocentra Works

## The Flow

Pretty straightforward: the Vocentra client captures voice or text input → our API processes it → GPT-4 does the magic → we return structured workflows and optionally send results to your productivity tools (WordPress, Notion, etc).

```
┌─────────────────┐
│  Vocentra App   │
│  (React Client) │
└────────┬────────┘
         │ POST /api/workflows/generate
         │ { prompt, workflowType }
         │ Authorization: Bearer <jwt>
         │
         ▼
┌─────────────────────────────────────────┐
│        API Gateway / Auth Layer         │
│  - JWT authentication                   │
│  - Rate limiting (60/min)               │
│  - JSON schema validation (Zod)         │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│      Processing Service (Node.js)       │
│  1. Parse prompt + workflowType         │
│  2. Apply template transformation       │
│  3. Call LLM/NLP (OpenAI)               │
│  4. Execute workflow logic              │
│  5. Persist to database                 │
└────────┬────────────────────────────────┘
         │
         ├──────────────┬──────────────┬──────────────┐
         │              │              │              │
         ▼              ▼              ▼              ▼
    ┌────────┐    ┌─────────┐   ┌─────────┐   ┌──────────┐
    │Database│    │WordPress│   │  Notion │   │  Asana   │
    │ (Prisma)│   │   API   │   │   API   │   │   API    │
    └────────┘    └─────────┘   └─────────┘   └──────────┘
         │
         ▼
┌─────────────────┐
│  Return JSON    │
│  { workflow }   │
└─────────────────┘
```

## Main Parts

**API Layer** (`server/src/server.js`)
- Express handles requests
- JWT auth for protected routes
- Rate limiting so nobody ddos's us
- Validates payloads with Zod

**Processing**
- `routeWorkflow()` - routes to the correct workflow handler
- `callOpenAI()` - GPT-4 calls
- Integration helpers - sends stuff to external services

**Deployment**
- Docker works anywhere (Cloud Run, ECS, Render)
- Serverless options (Vercel, Lambda)
- Regular hosting (Heroku, Railway)

## Security Stuff
- Secrets in `.env` (never commit these)
- HTTPS everywhere
- Validates all requests
- Rate limits to prevent abuse
- Redacts sensitive info from logs
