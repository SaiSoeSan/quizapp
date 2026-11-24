# Quiz App Backend

The backend for the Quiz App is an Express and Sequelize API backed by MySQL. It provides authentication, administration, student quiz workflows, database migrations, seed data, and interactive Swagger API documentation.

## Features

- User registration and JWT-based login
- Role-based admin and student API routes
- Question set, question, option, attempt, and answer management
- Sequelize migrations and seeders
- Swagger/OpenAPI documentation
- Claude-powered chat and stateless AI quiz generation
- JWT protection and per-user AI rate limits
- Jest and Supertest test suite
- Docker Compose development environment

## Requirements

- Node.js and npm
- MySQL 8 or Docker Desktop

## Installation

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Update `.env` with the credentials for your MySQL database:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=3306

PORT=3000
NODE_ENV=development

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key
ANTHROPIC_MODEL=claude-sonnet-5-5
ANTHROPIC_TIMEOUT_MS=30000

# AI rate limits (requests per minute)
AI_CHAT_RATE_LIMIT_MAX=20
AI_QUIZ_RATE_LIMIT_MAX=10
```

The database named by `DB_NAME` must exist before running migrations. When using the included Docker Compose configuration, the MySQL service creates this database automatically.

## Running locally

Run the development server with automatic restarts:

```bash
npm run dev
```

Run the server without Nodemon:

```bash
npm start
```

The API is available at [http://localhost:3000](http://localhost:3000) by default.

## Database commands

Run all pending migrations:

```bash
npm run db:migrate
```

Check migration status:

```bash
npm run db:migrate:status
```

Load the demo seed data:

```bash
npm run db:seed
```

Undo the latest migration or seed:

```bash
npm run db:rollback
npm run db:seed:undo
```

Undo all migrations or seeders:

```bash
npm run db:rollback:all
npm run db:seed:undo:all
```

## API routes

| Area | Base path | Description |
| --- | --- | --- |
| Authentication | `/api/auth` | Register and log in users |
| Administration | `/api/admin` | Manage users and question sets |
| Student | `/api/student` | Browse question sets and submit quiz attempts |
| AI | `/api/ai` | Chat with Claude and generate stateless quizzes |

The root endpoint returns a health response and the available API areas:

```text
GET /
```

## API documentation

Start the server, then open the Swagger UI at:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Authenticated endpoints use a JWT bearer token:

```text
Authorization: Bearer <token>
```

## Claude AI endpoints

Both AI endpoints require a valid JWT bearer token.

### Chat

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"message":"Explain artificial intelligence in simple terms."}'
```

Success:

```json
{
  "success": true,
  "data": {
    "message": "Artificial intelligence is..."
  }
}
```

### Generate a quiz

```bash
curl -X POST http://localhost:3000/api/ai/generate-quiz \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"topic":"JavaScript Fundamentals","numberOfQuestions":5,"difficulty":"beginner"}'
```

Success:

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

Generated quizzes are stateless and are not stored in the database.

## Docker Compose

The default Compose file starts both the API and MySQL:

```bash
cp .env.example .env
docker compose up --build
```

The API is exposed on port `3000` and MySQL on port `3306`. Run migrations from the backend container or from a local Node.js installation configured to connect to the database.

To stop the services:

```bash
docker compose down
```

To remove the persisted MySQL volume as well:

```bash
docker compose down -v
```

## Testing

The backend uses Jest and SuperTest for automated unit and HTTP integration testing. The test suite isolates Sequelize models with Jest mocks, so it can run without a live MySQL database.

The tests cover:

- Health and Swagger API endpoints
- User registration and login
- Request validation and duplicate email handling
- Password hashing and JWT generation
- Missing, invalid, and unknown-user bearer tokens
- Admin-only and student-only authorization
- Admin question set endpoints
- Student dashboard, question set, and attempt endpoints
- Controller error responses and database failures
- Claude chat, structured quiz generation, output validation, authentication, and rate limiting

Run the complete Jest test suite:

```bash
npm test
```

The current suite contains 74 tests across 5 test suites.

Run the focused AI tests:

```bash
npx jest --runInBand --watchman=false \
  services/aiService.test.js \
  validators/quizOutputValidator.test.js \
  controllers/aiController.test.js
```

Run only the HTTP API test file:

```bash
npx jest --runInBand --watchman=false app.test.js
```

Run Jest in watch mode:

```bash
npm run test:watch
```

## Project structure

```text
config/       Database and Swagger configuration
controllers/  Request handlers
middleware/   Authentication middleware
migrations/   Sequelize database migrations
models/       Sequelize models
routes/       API route definitions
services/     External provider integrations
validators/   LLM output validation
seeders/      Demo database seed data
app.js        Express application
server.js     Application entry point
```

## AI security and cost considerations

- Keep `ANTHROPIC_API_KEY` only in backend environment variables.
- Never commit `.env`, `.env.production`, or real credentials.
- AI endpoints require an existing JWT bearer token.
- Chat and quiz endpoints have separate per-user rate limits.
- Topic, message, question count, and difficulty inputs are validated before calling Claude.
- Claude JSON output is checked again for exact structure and valid quiz answers.
- Provider failures return generic `502`, `503`, or `504` responses.
- Logs contain outcomes, internal error codes, and request IDs, but not API keys, prompts, auth headers, or raw provider errors.
- Claude usage has API costs; set provider and application limits before public deployment.
