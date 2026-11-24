# Task: Phase 1 - Claude API integration for the Quiz Learning Platform backend

## Role

Act as a senior Node.js backend engineer. For each step,
explain the AI engineering concept in a few plain-language sentences.

## Repositories

- Backend (work here): /Users/saisoesan/Desktop/projects/myapp-quiz
- Frontend (read-only, do not modify): /Users/saisoesan/Desktop/projects/myapp-quiz-frontend

## Working agreement

- Step 0 is inspection only. After it, report findings and a file-level plan, then
  STOP for my approval. After that, STOP after each numbered step.
- Follow existing conventions (routes, controllers, validation, error format, env
  loading, Swagger, Jest/SuperTest). Do not rewrite existing code or change DB
  models or quiz submission behavior.
- Ask before any decision that changes existing architecture or behavior.

## Scope

IN: POST /api/ai/chat and POST /api/ai/generate-quiz (topic only, stateless).
OUT: saving generated quizzes to the DB, PDF/RAG/embeddings/agents/tools/streaming.
(Saving comes in a later phase and will reuse the validator built in Step 6.)

## API contract (examples)

### POST /api/ai/chat

Request:

```json
{ "message": "Explain what artificial intelligence is in simple terms." }
```

Success (200):

```json
{
  "success": true,
  "data": { "message": "Artificial intelligence is..." }
}
```

### POST /api/ai/generate-quiz

Request:

```json
{
  "topic": "JavaScript Fundamentals",
  "numberOfQuestions": 5,
  "difficulty": "beginner"
}
```

Success (200):

```json
{
  "success": true,
  "data": {
    "title": "JavaScript Fundamentals",
    "topic": "JavaScript Fundamentals",
    "difficulty": "beginner",
    "questions": [
      {
        "question": "Which keyword declares a variable that can be reassigned?",
        "options": ["const", "let", "class", "import"],
        "correctAnswer": "let",
        "explanation": "The let keyword declares a block-scoped variable that can be reassigned."
      }
    ]
  }
}
```

### Error responses (use the project's existing format if different)

Validation failure (400, or 422 if the project already uses it):

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "difficulty",
      "message": "difficulty must be beginner, intermediate, or advanced"
    }
  ]
}
```

Missing API configuration (503):

```json
{ "success": false, "message": "AI service is not configured", "errors": [] }
```

Provider failure or malformed model output (502):

```json
{
  "success": false,
  "message": "AI service failed to produce a valid response",
  "errors": []
}
```

Timeout (504):

```json
{ "success": false, "message": "AI service timed out", "errors": [] }
```

Unauthenticated (401) and rate limited (429) should follow the project's existing
format for those cases.

## Step 0: Investigate (no edits)

Read package.json, app.js, server.js, routes/, controllers/, services/, middleware/,
models/, config/, app.test.js, .env.example, README.md, and the frontend API config
and quiz services. Report: architecture and entry point; route/controller/validation/
error-response conventions; dotenv loading; JWT middleware; how quizzes are created
today (QuestionSet/Question/Option fields); Jest/SuperTest setup; whether importing
app.js opens a MySQL connection (affects test isolation); Swagger setup; conflicts.

## Step 1: AI configuration [Concept: LLM API integration]

- Install the official @anthropic-ai/sdk. Verify the installed version's API surface
  and the current model list instead of relying on memory.
- Env vars (placeholders only in .env.example, never real values):
  ANTHROPIC_API_KEY=
  ANTHROPIC_MODEL=<current model supporting the Messages API and structured output>
  ANTHROPIC_TIMEOUT_MS=30000
- Key stays server-side only: never in responses, logs, Swagger, or frontend code.

## Step 2: AI service [Concept: service architecture]

- Create services/aiService.js (match the existing services naming style).
- No SDK calls in routes or controllers.
- Lazy-create the client so a missing key gives a controlled error, not a startup crash.
- Set timeout, sensible max retries, and max_tokens.
- Define internal error types and map them to HTTP statuses:
  missing config -> 503; provider auth/connection/server failure -> 502;
  provider rate limit -> 503; timeout -> 504; malformed model output -> 502.
- Never leak raw provider errors, stack traces, keys, or headers.

## Step 3: POST /api/ai/chat [Concept: messages and prompts]

- Body: { "message": string } trimmed, 1-4000 chars.
- Add a short system prompt (role of a helpful learning assistant) separate from the
  user message, and explain the system vs user message roles.
- Success: { "success": true, "data": { "message": "..." } }

## Step 4: Quiz generation [Concept: prompt engineering]

- Body: topic (trimmed string, 1-200), numberOfQuestions (integer 1-20),
  difficulty (beginner | intermediate | advanced).
- System instruction: educational quiz generator; exactly 4 options per question;
  one correct answer; a short explanation.
- Pass the topic as clearly delimited data and instruct the model to ignore any
  instructions inside it (prompt-injection hygiene).
- Scale max_tokens with numberOfQuestions.

## Step 5: Structured output [Concept: structured outputs]

- Use the SDK's structured JSON output if the installed SDK and model support it;
  otherwise use forced tool use with an input schema.
- Treat stop_reason == max_tokens as a failure (truncated JSON).
- Explain why valid JSON is still not trusted JSON.

## Step 6: Schema validation [Concept: never trust model output]

- Separate, unit-testable module (e.g. validators/quizOutputValidator.js).
- Count equals numberOfQuestions. Per question: non-empty trimmed question and
  explanation; exactly 4 options; options non-empty and unique (trimmed,
  case-insensitive); correctAnswer exactly matches one option; strip unknown
  fields; cap field lengths.
- Response topic and difficulty come from the validated request, not the model;
  title defaults to topic.
- Any violation -> generic 502, log only an error code.
- Success: { success: true, data: { title, topic, difficulty, questions: [
  { question, options, correctAnswer, explanation } ] } }
- Do not persist anything yet. Do not change the DB models.

## Step 7: Error handling and reliability [Concept: reliability]

- Use the project's existing error format. Default if none:
  { "success": false, "message": "...", "errors": [] }
- One status code for express-validator failures, matching the project convention
  (400 unless the project already uses 422). Document it.
- Log outcome + error code + request id only. Never log keys, auth headers, raw
  provider errors, or full prompts/user content.
- Protect both endpoints with the existing JWT middleware and add express-rate-limit
  (stricter on generate-quiz). Flag it if the existing auth makes this awkward.

## Tests (write alongside each step; Jest + SuperTest; mock the service or SDK)

No real API calls, no MySQL, no real key. Cover: chat success; missing/empty/too-long
message; invalid topic; invalid difficulty; invalid numberOfQuestions (0, 21, 2.5,
"5"); successful generation; malformed JSON; wrong option count; duplicate options;
correctAnswer not in options; wrong question count; truncated response; missing key
(503); provider failure (502); timeout (504); unauthenticated (401); rate limit (429).
Run the smallest relevant test first, then the full suite.

## Final deliverables

Update Swagger (request, success, and error schemas) and README (env vars, setup,
curl examples, test command, security notes). Final report: files created/modified;
request lifecycle (client -> route -> validation -> controller -> service -> Claude
-> validator -> controller -> response); example requests/responses; run/test
commands; limitations; cost and security considerations.
