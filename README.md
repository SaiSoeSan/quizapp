# Quiz App Backend

The backend for the Quiz App is an Express and Sequelize API backed by MySQL. It provides authentication, administration, student quiz workflows, database migrations, seed data, and interactive Swagger API documentation.

## Features

- User registration and JWT-based login
- Role-based admin and student API routes
- Question set, question, option, attempt, and answer management
- Sequelize migrations and seeders
- Swagger/OpenAPI documentation
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

Run the Jest test suite:

```bash
npm test
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
seeders/      Demo database seed data
app.js        Express application
server.js     Application entry point
```
