# Task Management System - Backend

This is the backend API for the Task Management System built with NestJS and TypeScript.

## Technologies Used

- **NestJS**: Progressive Node.js framework
- **TypeScript**: Type-safe JavaScript
- **TypeORM**: ORM for database operations
- **SQLite**: Lightweight database
- **Swagger**: API documentation

## Features

- CRUD operations for Projects
- CRUD operations for Users
- CRUD operations for Tasks
- Automatic database synchronization
- API documentation with Swagger
- Input validation
- CORS enabled

## Installation

```bash
npm install
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will run on http://localhost:3000

## API Documentation

Swagger documentation is available at: http://localhost:3000/api

## API Endpoints

### Users
- GET /users - Get all users
- GET /users/:id - Get user by ID
- POST /users - Create user
- PATCH /users/:id - Update user
- DELETE /users/:id - Delete user

### Projects
- GET /projects - Get all projects
- GET /projects/:id - Get project by ID
- POST /projects - Create project
- PATCH /projects/:id - Update project
- DELETE /projects/:id - Delete project

### Tasks
- GET /tasks - Get all tasks
- GET /tasks/:id - Get task by ID
- GET /tasks/project/:projectId - Get tasks by project
- POST /tasks - Create task
- PATCH /tasks/:id - Update task
- DELETE /tasks/:id - Delete task

## Database

The application uses SQLite. The database file (database.sqlite) will be created automatically on first run.
