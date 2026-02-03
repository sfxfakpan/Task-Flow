# Task Flow - Full Stack Application

A comprehensive task management application with user authentication, board management, and task organization with position-based ordering.

## Project Structure

- **Backend**: NestJS application with TypeORM, PostgreSQL, and JWT authentication
- **Frontend**: Angular application with TypeScript and Tailwind CSS
- **Database**: PostgreSQL with migrations support

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
# Copy .env.example to .env and update database credentials

# Run migrations
pnpm nx run backend:migration:run

# Start backend server
pnpm nx serve backend

# Start frontend (in another terminal)
pnpm nx serve frontend
```

Backend runs on `http://localhost:3000/api`
Frontend runs on `http://localhost:4200`

---

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints Overview

### Authentication Endpoints

#### Register User
**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGc..."
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed (invalid email, short password, etc.)
- `409 Conflict` - User with this email already exists

---

#### Login User
**POST** `/auth/login`

Authenticates user with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGc..."
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed
- `401 Unauthorized` - Invalid email or password

---

#### Get Current User Profile
**GET** `/auth/me`

Retrieves the profile of the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token

---

### Board Endpoints

#### Get All Boards (Current User)
**GET** `/boards`

Retrieves all boards owned by the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "Project Board",
    "description": "Main project board",
    "userId": "uuid",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "deletedAt": null
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token

---

#### Get Specific Board
**GET** `/boards/:id`

Retrieves a specific board by ID. User must be the board owner.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Project Board",
  "description": "Main project board",
  "userId": "uuid",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "deletedAt": null
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not the board owner
- `404 Not Found` - Board does not exist

---

#### Create Board
**POST** `/boards`

Creates a new board for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Project Board",
  "description": "Description of the board"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "name": "New Project Board",
  "description": "Description of the board",
  "userId": "uuid",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "deletedAt": null
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed (missing name, etc.)
- `401 Unauthorized` - Missing or invalid token

---

#### Update Board
**PATCH** `/boards/:id`

Updates an existing board. User must be the board owner.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Board Name",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Updated Board Name",
  "description": "Updated description",
  "userId": "uuid",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z",
  "deletedAt": null
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not the board owner
- `404 Not Found` - Board does not exist

---

#### Delete Board
**DELETE** `/boards/:id`

Soft deletes a board. User must be the board owner. **Cascades**: All tasks in the board are also deleted.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not the board owner
- `404 Not Found` - Board does not exist

---

### Task Endpoints

#### Get All Tasks (Board)
**GET** `/boards/:boardId/tasks`

Retrieves all tasks in a specific board. User must be the board owner.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "title": "Setup Frontend",
    "description": "Initialize React components",
    "status": "TODO",
    "priority": "HIGH",
    "position": 0,
    "boardId": "uuid",
    "assigneeId": null,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "deletedAt": null
  },
  {
    "id": "uuid",
    "title": "Build API",
    "description": "Create REST API endpoints",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "position": 1,
    "boardId": "uuid",
    "assigneeId": null,
    "createdAt": "2024-01-15T10:05:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "deletedAt": null
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not the board owner
- `404 Not Found` - Board does not exist

---

#### Get Specific Task
**GET** `/boards/:boardId/tasks/:taskId`

Retrieves a specific task by ID. User must be the board owner.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "Setup Frontend",
  "description": "Initialize React components",
  "status": "TODO",
  "priority": "HIGH",
  "position": 0,
  "boardId": "uuid",
  "assigneeId": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "deletedAt": null
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not the board owner or task doesn't belong to board
- `404 Not Found` - Task or board does not exist

---

#### Create Task
**POST** `/boards/:boardId/tasks`

Creates a new task in a specific board. User must be the board owner.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Setup Frontend",
  "description": "Initialize React components",
  "status": "TODO",
  "priority": "HIGH",
  "position": 0
}
```

**Status Options:** `TODO`, `IN_PROGRESS`, `DONE`
**Priority Options:** `LOW`, `MEDIUM`, `HIGH`

**Response (201 Created):**
```json
{
  "id": "uuid",
  "title": "Setup Frontend",
  "description": "Initialize React components",
  "status": "TODO",
  "priority": "HIGH",
  "position": 0,
  "boardId": "uuid",
  "assigneeId": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "deletedAt": null
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed (invalid status, priority, etc.)
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not the board owner
- `404 Not Found` - Board does not exist

---

#### Update Task
**PATCH** `/boards/:boardId/tasks/:taskId`

Updates a task. User must be the board owner.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "position": 0,
  "boardId": "uuid",
  "assigneeId": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z",
  "deletedAt": null
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not the board owner or task doesn't belong to board
- `404 Not Found` - Task or board does not exist

---

#### Update Task Position (Drag & Drop)
**PATCH** `/boards/:boardId/tasks/:taskId/position`

Updates task position for drag-drop reordering. Automatically adjusts other tasks' positions.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "position": 2,
  "status": "DONE"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "Setup Frontend",
  "description": "Initialize React components",
  "status": "DONE",
  "priority": "HIGH",
  "position": 2,
  "boardId": "uuid",
  "assigneeId": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z",
  "deletedAt": null
}
```

**Error Responses:**
- `400 Bad Request` - Invalid position value
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not the board owner or task doesn't belong to board
- `404 Not Found` - Task or board does not exist

---

#### Delete Task
**DELETE** `/boards/:boardId/tasks/:taskId`

Soft deletes a task. User must be the board owner.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User is not the board owner or task doesn't belong to board
- `404 Not Found` - Task or board does not exist

---

## Testing

### Using Postman

1. **Import Collection**: Open Postman and import `Task-Flow-API.postman_collection.json`
2. **Collection Features**:
   - Pre-configured requests for all endpoints
   - Automatic token management (tokens stored in collection variables)
   - Built-in test assertions
   - Full user flow testing (register, login, create board, create tasks)
   - Authorization testing (User A vs User B)
   - Cascading delete verification
   - Position logic testing
   - All error cases (401, 403, 404, 409)

### Test Scenarios Included

1. **Complete User Flow**
   - Register new users
   - Login to get tokens
   - Create boards
   - Create multiple tasks
   - Update task statuses

2. **Authorization Testing**
   - User A can only access own boards
   - User B cannot access User A's boards
   - Proper 403 Forbidden responses

3. **Cascading Deletes**
   - Delete task and verify it's removed
   - Delete board and verify all related tasks are deleted

4. **Position Logic**
   - Create tasks with sequential positions
   - Reorder tasks and verify positions update
   - Verify tasks remain ordered

5. **Error Cases**
   - 401 Unauthorized (missing/invalid token)
   - 403 Forbidden (no permission)
   - 404 Not Found (resource doesn't exist)
   - 409 Conflict (duplicate email on register)

---

## Error Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 400 | Bad Request | Invalid input data, validation failed |
| 401 | Unauthorized | Missing token, invalid token, expired token |
| 403 | Forbidden | No permission to access resource |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email, unique constraint violation |
| 500 | Internal Server Error | Server error |

---

## Data Models

### User Entity
```typescript
{
  id: string (UUID)
  firstName: string
  lastName: string
  email: string (unique)
  password: string (hashed)
  boards: Board[]
  assignedTasks: Task[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

### Board Entity
```typescript
{
  id: string (UUID)
  name: string
  description: string
  userId: string (foreign key)
  user: User
  tasks: Task[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

### Task Entity
```typescript
{
  id: string (UUID)
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  position: number (for ordering)
  boardId: string (foreign key)
  board: Board
  assigneeId: string | null (foreign key)
  assignee: User | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

---

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control (ownership verification)
- ✅ Soft deletes (data retention)
- ✅ CORS enabled
- ✅ Bearer token validation
- ✅ Ownership guards on all protected resources

---

## Development Commands

```bash
# Build backend
pnpm nx build backend

# Serve backend (development mode with hot reload)
pnpm nx serve backend

# Run backend tests
pnpm nx test backend

# Build frontend
pnpm nx build frontend

# Serve frontend
pnpm nx serve frontend

# Run frontend tests
pnpm nx test frontend

# View project graph
pnpm nx graph

# Run end-to-end tests
pnpm nx e2e backend-e2e
```

---

## Postman Collection

The `Task-Flow-API.postman_collection.json` file contains:
- ✅ All API endpoints
- ✅ Pre-configured test assertions
- ✅ Collection variables for tokens and IDs
- ✅ Complete test scenarios
- ✅ Error case testing

**To use:**
1. Download [Postman](https://www.postman.com/downloads/)
2. Open Postman and go to File → Import
3. Select `Task-Flow-API.postman_collection.json`
4. Run requests in order to test the complete flow
5. All tokens and IDs are automatically captured and reused

---

## Next Steps

- Share `Task-Flow-API.postman_collection.json` with frontend team
- Run Postman collection to verify all endpoints
- Review test results and assertions
- Deploy to staging for integration testing

---

## License

MIT
