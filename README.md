# TaskFlow

TaskFlow is a full-stack personal task manager built with React, TypeScript, Spring Boot, Spring Security, JWT, Spring Data JPA, and MySQL. The project demonstrates a complete authenticated workflow: users can register, log in, and manage only their own tasks through a protected REST API.

## Why I Built It

I built TaskFlow to practice the full path between frontend and backend development: authentication, protected API calls, user-owned data, DTOs, validation, persistence, and error handling in the UI. It is intentionally simple as a product, but complete enough to show how the pieces of a real full-stack app fit together.

## Main Features

- User registration and login.
- JWT-based authentication.
- Private tasks per authenticated user.
- Full CRUD for tasks.
- Task states: `PENDIENTE`, `EN_PROGRESO`, `COMPLETADO`.
- Task priorities: `BAJA`, `MEDIA`, `ALTA`.
- Optional due dates.
- Search and priority filtering in the frontend.
- Visual feedback when tasks are completed.
- Frontend error handling for loading, creating, updating, deleting, and status changes.
- DTO-based API responses so JPA entities are not exposed directly.
- Backend tests for task ownership and service behavior.

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, TypeScript, Vite, Axios |
| Backend | Java 21, Spring Boot, Spring Security |
| Auth | JWT |
| Persistence | Spring Data JPA, MySQL |
| Testing | JUnit 5, Mockito, Spring Boot Test |
| Build tools | npm, Maven Wrapper |

## Architecture

```text
React + TypeScript
  -> Axios client with JWT header
  -> Spring Boot REST API
  -> Spring Security filter chain
  -> Task service with user ownership checks
  -> Spring Data JPA repositories
  -> MySQL database
```

## Security Model

TaskFlow does not rely on the frontend to filter private data. The backend extracts the user from the JWT token and uses that user when listing, reading, updating, or deleting tasks. This means each task operation is scoped to the authenticated user.

The API also uses DTOs:

- `TaskRequest` for accepted create/update fields.
- `TaskResponse` for data returned to the frontend.
- `AuthRequest` and `AuthResponse` for login and registration.

## Project Structure

```text
Taskflow/
|-- frontend/
|   |-- src/
|   |   |-- api/taskApi.ts       # Axios client and task API calls
|   |   |-- pages/Dashboard.tsx   # Authenticated task board
|   |   |-- pages/Login.tsx       # Login/register screen
|   |   |-- types/Task.ts         # TypeScript task models
|   |   `-- App.tsx              # Auth state and routing logic
|   |-- package.json
|   `-- vite.config.ts
|-- backend/
|   |-- src/main/java/com/example/backend/
|   |   |-- config/               # Security configuration
|   |   |-- controller/           # Auth and task controllers
|   |   |-- dto/                  # API DTOs
|   |   |-- model/                # JPA entities
|   |   |-- repository/           # Spring Data repositories
|   |   `-- service/              # JWT and task logic
|   |-- src/test/                # Backend tests
|   `-- pom.xml
`-- README.md
```

## Run Locally

### Requirements

- Node.js and npm.
- Java 21 or newer.
- MySQL.
- Maven Wrapper, included in the backend folder.

### 1. Configure MySQL

Create a local database:

```sql
CREATE DATABASE taskflow;
```

Configure `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskflow
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

For a production deployment, move database credentials and the JWT secret into environment variables.

### 2. Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```powershell
cd backend
.\mvnw spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Main API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```http
GET    /api/tasks
GET    /api/tasks/{id}
POST   /api/tasks
PUT    /api/tasks/{id}
PATCH  /api/tasks/{id}/status
DELETE /api/tasks/{id}
```

All task endpoints require:

```http
Authorization: Bearer <token>
```

## Tests and Checks

Backend tests:

```bash
cd backend
./mvnw test
```

Frontend build check:

```bash
cd frontend
npm run build
```

## What I Learned

- Connecting a React frontend to a real REST API.
- Managing JWT authentication on both frontend and backend.
- Protecting user-owned data in the service layer.
- Handling CORS between frontend and backend during local development.
- Using DTOs instead of exposing JPA entities directly.
- Writing backend tests with JUnit and Mockito.
- Debugging integration issues between UI, API, auth, and database.

## Roadmap

- Add OpenAPI/Swagger documentation.
- Add integration tests for REST endpoints.
- Add frontend tests with React Testing Library.
- Move configuration to environment variables for deployment.
- Deploy frontend and backend with a managed MySQL database.
- Improve responsive layout for smaller screens.
