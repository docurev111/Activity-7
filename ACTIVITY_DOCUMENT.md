# Activity 7: Task Management System

## Project Description

This is a full-stack web application for managing projects, tasks, and team members. It provides a comprehensive dashboard for tracking project progress, managing tasks with deadlines, and assigning work to team members.

### What the App Does:
- Create and manage projects with start and end dates
- Assign tasks to projects and users
- Track task status (To Do, In Progress, Completed)
- Monitor deadlines with overdue alerts
- View project progress with completion percentages
- Manage team members (users)
- Interactive dashboard with statistics

## Technologies Used

### Backend
- **Node.js + NestJS**: Server framework
- **TypeScript**: Programming language
- **SQLite**: Lightweight database
- **TypeORM**: Database ORM
- **Swagger**: API documentation

### Frontend
- **ReactJS**: UI library
- **Vite**: Build tool
- **Axios**: HTTP client
- **CSS3**: Styling

## How to Run the Project

### Prerequisites
- Node.js (v18 or higher)
- npm

### Backend Setup
1. Navigate to backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Start server: `npm run start:dev`
4. Backend runs on http://localhost:3000
5. Swagger docs at http://localhost:3000/api

### Frontend Setup
1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start server: `npm run dev`
4. Frontend runs on http://localhost:5173

## Screenshots

### 1. Dashboard View
The main dashboard displays:
- Statistics cards showing total projects, tasks, completed tasks, and team members
- Project cards with progress bars
- Task lists within each project
- Quick action buttons to add users, projects, and tasks

### 2. Project Card
Each project card shows:
- Project name and description
- Start and end dates
- Progress bar with completion percentage
- Number of completed vs total tasks
- View Tasks button to expand task list
- Delete button

### 3. Task Management
Tasks display:
- Task title and description
- Assigned user
- Deadline (with overdue warning if applicable)
- Status dropdown (To Do, In Progress, Completed)
- Color-coded status indicators
- Delete button

### 4. Add Forms
Modal forms for creating:
- **Users**: Name and email
- **Projects**: Name, description, start date, end date
- **Tasks**: Title, description, project, assigned user, status, deadline

### 5. Swagger API Documentation
Interactive API documentation at http://localhost:3000/api showing:
- All available endpoints for Users, Projects, and Tasks
- Request/response schemas
- Ability to test APIs directly

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Projects
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `POST /projects` - Create project
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Tasks
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get task by ID
- `GET /tasks/project/:projectId` - Get tasks by project
- `POST /tasks` - Create task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## Features

### Backend
- RESTful API design
- Data validation with class-validator
- Entity relationships (Projects have Tasks, Users have Tasks)
- SQLite database (no setup needed)
- CORS enabled for frontend communication
- Swagger documentation

### Frontend
- Responsive dashboard layout
- Real-time statistics
- Project progress tracking
- Task status management
- Deadline monitoring with overdue alerts
- Modal forms for data entry
- Color-coded status indicators
- Smooth animations and transitions

## Database Schema

### Users Table
- id (Primary Key)
- name
- email

### Projects Table
- id (Primary Key)
- name
- description
- startDate
- endDate

### Tasks Table
- id (Primary Key)
- title
- description
- status (todo, in-progress, completed)
- deadline
- projectId (Foreign Key)
- userId (Foreign Key)

## Summary

This Activity 7 project is a complete task management application that demonstrates:

1. **Full-Stack Development**: Backend API + Frontend UI
2. **Database Relationships**: One-to-Many relationships
3. **Modern Frameworks**: NestJS + React + Vite
4. **TypeScript**: Type-safe code throughout
5. **API Documentation**: Swagger
6. **Project Management Features**: Tasks, deadlines, status tracking
7. **Clean Code**: Modular structure, separation of concerns
8. **User Experience**: Responsive design, interactive dashboard

### Project Status:  COMPLETE

All requirements met:
-  Backend CRUD for projects, users, and tasks
-  Frontend dashboard for projects and tasks with deadlines
-  SQLite database with proper relationships
-  API documentation (Swagger)
-  README files for both backend and frontend
-  Activity document with instructions

### Testing Performed
-  Backend builds and runs successfully
-  API endpoints tested via Swagger
-  Frontend displays correctly
-  Users can be created and assigned to tasks
-  Projects can be created and managed
-  Tasks can be created, updated, and deleted
-  Progress tracking works correctly
-  Deadline monitoring shows overdue alerts
-  Integration between frontend and backend works

---

**Author**: Created for Web Development Class
**Activity**: Activity 7 - Task Management System
**Date**: January 2026
