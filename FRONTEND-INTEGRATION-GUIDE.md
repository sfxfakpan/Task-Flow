# Task Flow API - Frontend Team Integration Guide

## Quick Start for Frontend

### What You're Getting

1. **Postman Collection** (`Task-Flow-API.postman_collection.json`)
   - 40+ pre-configured API requests
   - All test scenarios included
   - Automatic token and ID management
   - Ready to import and use

2. **Complete API Documentation** (`API-DOCUMENTATION.md`)
   - All endpoints with examples
   - Request/response formats
   - Error handling guide
   - Data models

3. **Implementation Examples**
   - Test scenarios showing complete flows
   - Authorization patterns
   - Error handling patterns

---

## Setup Instructions

### 1. Install Postman (if not already installed)
```bash
# macOS
brew install postman

# Or download from https://www.postman.com/downloads/
```

### 2. Import the Collection
- Open Postman
- Click `File` → `Import`
- Select `Task-Flow-API.postman_collection.json`
- Collection will appear in the left sidebar

### 3. Start Backend (if testing locally)
```bash
cd /path/to/Task-Flow
pnpm nx serve backend
# API will be available at http://localhost:3000/api
```

### 4. Run Test Scenarios
- In Postman, select the collection
- Click the play button (▶️) to "Run collection"
- Select all requests
- Click "Start Test Run"
- Review results

---

## API Base URL

**Development**:
```
http://localhost:3000/api
```

**Staging** (when deployed):
```
https://staging-api.taskflow.com/api
```

**Production** (when deployed):
```
https://api.taskflow.com/api
```

---

## Available Test Scenarios

### 1. Complete User Flow
- User registration
- User login
- Create board
- Create multiple tasks
- Verify task ordering

**Result**: Should pass all steps with proper tokens and IDs

### 2. Authorization Testing
- User A creates board
- User B cannot access User A's board
- Returns 403 Forbidden as expected

**Result**: Confirms ownership verification works

### 3. Task Position Logic
- Create 3 tasks with positions
- Reorder tasks via position update
- Verify new ordering is correct

**Result**: Drag-drop ordering will work in frontend

### 4. Cascading Deletes
- Delete task from board
- Delete entire board (deletes all tasks)
- Verify tasks are deleted with board

**Result**: Cleanup operations work properly

### 5. Error Handling
- Invalid authentication (401)
- No permission (403)
- Resource not found (404)
- Duplicate data (409)

**Result**: Frontend can handle all error cases

---

## Key Endpoints for Frontend

### Authentication
```javascript
// Register
POST /auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

// Login
POST /auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Get current user
GET /auth/me
Headers: Authorization: Bearer <token>
```

### Boards
```javascript
// Get user's boards
GET /boards
Headers: Authorization: Bearer <token>

// Create board
POST /boards
Headers: Authorization: Bearer <token>
{
  "name": "Project Board",
  "description": "Description"
}

// Delete board (cascades to tasks)
DELETE /boards/:boardId
Headers: Authorization: Bearer <token>
```

### Tasks
```javascript
// Get tasks in board
GET /boards/:boardId/tasks
Headers: Authorization: Bearer <token>

// Create task
POST /boards/:boardId/tasks
Headers: Authorization: Bearer <token>
{
  "title": "Task Title",
  "description": "Task description",
  "status": "TODO",
  "priority": "HIGH",
  "position": 0
}

// Update task status
PATCH /boards/:boardId/tasks/:taskId
Headers: Authorization: Bearer <token>
{
  "status": "IN_PROGRESS",
  "description": "Updated"
}

// Reorder task (for drag-drop)
PATCH /boards/:boardId/tasks/:taskId/position
Headers: Authorization: Bearer <token>
{
  "position": 2,
  "status": "DONE"
}

// Delete task
DELETE /boards/:boardId/tasks/:taskId
Headers: Authorization: Bearer <token>
```

---

## Frontend Integration Checklist

- [ ] Import Postman collection
- [ ] Run all test scenarios
- [ ] Update base URL if needed
- [ ] Verify token storage/retrieval in localStorage
- [ ] Implement error handling (401, 403, 404, 409)
- [ ] Test registration form
- [ ] Test login flow
- [ ] Test board CRUD
- [ ] Test task CRUD
- [ ] Test drag-drop reordering
- [ ] Test cascading deletes
- [ ] Test authorization (other users' boards)

---

## HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Success |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input - show user error message |
| 401 | Unauthorized | No/invalid token - redirect to login |
| 403 | Forbidden | No permission - show access denied message |
| 404 | Not Found | Resource doesn't exist - show not found message |
| 409 | Conflict | Duplicate data - show conflict message |

---

## Error Handling Examples

### 401 Unauthorized
```javascript
// No token or invalid token
if (error.status === 401) {
  // Redirect to login
  router.navigate(['/login']);
  // Clear stored token
  localStorage.removeItem('authToken');
}
```

### 403 Forbidden
```javascript
// User doesn't own this resource
if (error.status === 403) {
  // Show "You don't have permission" message
  showError('You do not have permission to access this resource');
}
```

### 404 Not Found
```javascript
// Resource doesn't exist
if (error.status === 404) {
  // Show "Not found" message
  showError('The requested resource was not found');
}
```

### 409 Conflict
```javascript
// Email already exists during registration
if (error.status === 409) {
  // Show "Email already in use" message
  showError('A user with this email already exists');
}
```

---

## Token Management

### Storing Token
```javascript
// After successful login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();

// Store token
localStorage.setItem('authToken', data.token);
localStorage.setItem('userId', data.id);
```

### Using Token in Requests
```javascript
// All authenticated requests need Authorization header
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
};

const response = await fetch('http://localhost:3000/api/boards', {
  method: 'GET',
  headers
});
```

### Clearing Token
```javascript
// On logout
localStorage.removeItem('authToken');
localStorage.removeItem('userId');
router.navigate(['/login']);
```

---

## Data Models

### User
```typescript
{
  id: string (UUID)
  firstName: string
  lastName: string
  email: string
  token: string
}
```

### Board
```typescript
{
  id: string (UUID)
  name: string
  description: string
  userId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

### Task
```typescript
{
  id: string (UUID)
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  position: number (0-based, used for ordering)
  boardId: string
  assigneeId: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

---

## Example Angular Component Implementation

### Task List Component
```typescript
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  boardId: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTasks();
  }

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
  }

  loadTasks() {
    this.http.get(
      `http://localhost:3000/api/boards/${this.boardId}/tasks`,
      { headers: this.getHeaders() }
    ).subscribe(
      (data: any) => this.tasks = data,
      (error) => this.handleError(error)
    );
  }

  createTask(title: string, priority: string) {
    const body = {
      title,
      priority,
      status: 'TODO',
      position: this.tasks.length
    };
    
    this.http.post(
      `http://localhost:3000/api/boards/${this.boardId}/tasks`,
      body,
      { headers: this.getHeaders() }
    ).subscribe(
      (task: any) => this.tasks.push(task),
      (error) => this.handleError(error)
    );
  }

  updateTaskStatus(taskId: string, status: string) {
    this.http.patch(
      `http://localhost:3000/api/boards/${this.boardId}/tasks/${taskId}`,
      { status },
      { headers: this.getHeaders() }
    ).subscribe(
      (task: any) => {
        const index = this.tasks.findIndex(t => t.id === taskId);
        this.tasks[index] = task;
      },
      (error) => this.handleError(error)
    );
  }

  reorderTask(taskId: string, newPosition: number) {
    this.http.patch(
      `http://localhost:3000/api/boards/${this.boardId}/tasks/${taskId}/position`,
      { position: newPosition },
      { headers: this.getHeaders() }
    ).subscribe(
      () => this.loadTasks(),
      (error) => this.handleError(error)
    );
  }

  handleError(error: any) {
    if (error.status === 401) {
      // Redirect to login
      localStorage.removeItem('authToken');
    } else if (error.status === 403) {
      alert('You do not have permission');
    } else if (error.status === 404) {
      alert('Resource not found');
    }
  }
}
```

---

## Testing the Integration

1. **Test Register Flow**
   - Go to Postman
   - Run "Register User A"
   - Should return 201 with token

2. **Test Login Flow**
   - Run "Login User A"
   - Should return 200 with token

3. **Test Board Creation**
   - Run "Create Board - User A"
   - Should return 201 with board ID

4. **Test Task Creation**
   - Run "Create Task 1 - User A Board"
   - Should return 201 with task ID

5. **Test Task Reordering**
   - Run "Update Task Position - Reorder"
   - Should return 200 with updated position

6. **Test Authorization**
   - Run "User A Cannot Access User B's Board (403)"
   - Should return 403 Forbidden

---

## Support & Documentation

- **Full API Docs**: See `API-DOCUMENTATION.md`
- **Test Guide**: See `TEST-EXECUTION-GUIDE.md`
- **Postman Collection**: `Task-Flow-API.postman_collection.json`

---

## Questions?

1. Check the API documentation
2. Review test scenarios in Postman
3. Run tests to see examples of requests/responses
4. Check status codes and error messages for debugging

---

Good luck with the frontend implementation! 🚀
