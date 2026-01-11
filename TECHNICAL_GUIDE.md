# Flowdesk — Beginner-Friendly System Guide

This document explains **how the Flowdesk task management app works**, in plain language.

The app is made of two halves that talk to each other:

1. **Backend (server)**: the "brain + storage". It manages projects, tasks, and users.
2. **Frontend (website)**: the "face". It shows the dashboard and lets you interact with everything.

When you present: think of it like a project management office:
- **Frontend** = the bulletin board + project manager (what you see, where you organize)
- **Backend** = the filing system + coordinator (does the work, stores data)
- **Database** = the file cabinets (stores all projects, tasks, and team members)
- **API** = the communication system (how frontend asks backend for things)

---

## What folders matter most

### `backend/`
This is the server side.
- It contains the API endpoints for Users, Projects, and Tasks
- It connects to the SQLite database file
- It has Swagger documentation (interactive API testing)

### `frontend/`
This is the website.
- It shows a dashboard with project cards, task lists, and statistics
- It has a theme toggle (light/dark/system mode)
- It talks to the backend using **HTTP requests** (Axios library)
- No real-time features (standard request/response)

---

## The big picture flow (most important)

### Flow A — Loading the Dashboard (the main view)
1. User opens the website at http://localhost:5173
2. The website asks the backend for three things at once:
   - `GET /projects` (all projects)
   - `GET /users` (all team members)
   - `GET /tasks` (all tasks)
3. The backend reads from the database and returns all the data
4. The website displays:
   - **Statistics cards**: total projects, total tasks, completed tasks, team members
   - **Project cards**: each showing name, dates, progress bar, task count
   - **Tasks** (when you click "View Tasks" on a project)

**Beginner translation:**
It's like opening a project management board — the system loads everything at once so you can see the big picture: what projects exist, who's on the team, and what tasks need to be done.

---

### Flow B — Creating a Project (organizing work)
1. User clicks "Add Project" button
2. A popup form appears
3. User fills in:
   - Project name (e.g., "Website Redesign")
   - Description
   - Start date
   - End date
4. User clicks "Submit"
5. The website sends the data to the backend:
   - `POST /projects` with the project information
6. The backend:
   - Validates the data (checks dates are valid, nothing is empty)
   - Saves it to the database
   - Returns the new project
7. The website refreshes all data to show the new project card

**Beginner translation:**
It's like creating a new folder for a work project — you give it a name, description, and timeline, and the system files it away.

---

### Flow C — Creating a Task (assigning work)
1. User clicks "Add Task" button
2. A popup form appears
3. User fills in:
   - Task title (e.g., "Design homepage mockup")
   - Description
   - **Which project** it belongs to (dropdown)
   - **Who** is assigned to it (dropdown of users)
   - Status (To Do / In Progress / Completed)
   - Deadline date
4. User clicks "Submit"
5. The website sends:
   - `POST /tasks` with all the task information
6. The backend:
   - Links the task to the selected project (using `projectId`)
   - Links the task to the selected user (using `userId`)
   - Saves everything to the database
7. The website refreshes to show the task in its project

**Beginner translation:**
It's like putting a sticky note on someone's desk — you write what needs to be done, who should do it, and when it's due. The system remembers which project folder it belongs to.

---

### Flow D — Tracking Progress (the smart part)
**This happens automatically every time you view the dashboard.**

For each project, the system:
1. Counts how many tasks belong to that project
2. Counts how many are marked "Completed"
3. Calculates the percentage: `(completed ÷ total) × 100`
4. Displays a progress bar that fills up based on the percentage

Example:
- Project: "Website Redesign"
- Total tasks: 10
- Completed: 7
- **Progress: 70%** (progress bar is 70% filled)

**Color coding:**
- **Red** (To Do) = hasn't started
- **Orange** (In Progress) = actively working
- **Green** (Completed) = finished

**Overdue alerts:**
- If a task's deadline is in the past, it shows "(Overdue!)" in red

**Beginner translation:**
The system acts like a smart assistant — it automatically tracks how much work is done and warns you about late tasks.

---

## Backend: purpose of the key files (server)

### `backend/src/main.ts`
**What it is:** the server's start button.

**What it does:**
- Creates the backend application
- Turns on **CORS** (lets the frontend talk to it from a different port)
- Turns on **validation** (rejects bad data automatically)
- Generates Swagger docs at `/api`
- Starts listening on port 3000

**Important code:**
```typescript
app.enableCors();
```

**Beginner translation:**
CORS is like a security guard. By default, the guard says "you're from a different address, go away." `enableCors()` tells the guard "actually, let them through."

Without this line:
- Frontend (port 5173) can't talk to backend (port 3000)
- Browser blocks all requests
- App won't work

---

### `backend/src/app.module.ts`
**What it is:** the backend's "wiring hub".

**What it does:**
- Connects the database (SQLite file named `database.sqlite`)
- Registers all feature modules:
  - Users
  - Projects
  - Tasks
- Tells TypeORM to create tables automatically (`synchronize: true`)

**Beginner translation:**
This is the central control panel that says: "These are all the parts of my app. Connect them together and make them work."

---

### `backend/src/entities/*.entity.ts` (data blueprints)
These files describe what gets stored in the database.

Think: **Entity = a template** for a database table.

#### `user.entity.ts`
Stores team members.
- `id`: unique user number (auto-generated)
- `name`: person's name (e.g., "Sarah Chen")
- `email`: email address
- `tasks`: connection to all tasks assigned to this user

**Important line:**
```typescript
@OneToMany(() => Task, task => task.user, { cascade: ['remove'] })
```

**Beginner translation:**
"One user can have many tasks assigned to them. If I delete the user, remove them from all their tasks (but don't delete the tasks themselves)."

---

#### `project.entity.ts`
Stores projects.
- `id`: unique project number
- `name`: project title (e.g., "Mobile App Development")
- `description`: what the project is about
- `startDate`: when it begins (stored as date)
- `endDate`: when it should finish (stored as date)
- `tasks`: connection to all tasks in this project

**Important line:**
```typescript
@OneToMany(() => Task, task => task.project, { cascade: ['remove'] })
```

**Beginner translation:**
"One project has many tasks. If I delete the project, delete all its tasks too."

---

#### `task.entity.ts`
Stores individual tasks (the work items).
- `id`: unique task number
- `title`: task name (e.g., "Design homepage")
- `description`: details about what to do
- `status`: current state (`'todo'`, `'in-progress'`, or `'completed'`)
- `deadline`: due date (stored as date)
- `projectId`: which project this belongs to (foreign key)
- `userId`: who is assigned to it (foreign key)
- `project`: link to the Project object
- `user`: link to the User object

**Important relationships:**
```typescript
@ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE' })
@ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
```

**Beginner translation:**
"Many tasks belong to one project. Many tasks can be assigned to one user. If the project gets deleted, delete all its tasks (CASCADE). If the user gets deleted, the tasks still exist but lose their assignment."

---

### `backend/src/users/*` (user management)
These files handle team member operations.

#### `users.controller.ts`
**What it is:** where the URL routes live.

Examples:
- `POST /users` — create a new user
- `GET /users` — get all users
- `GET /users/:id` — get one specific user
- `PATCH /users/:id` — update a user
- `DELETE /users/:id` — delete a user

#### `users.service.ts`
**What it is:** the "business logic" for users.

What it does:
- `create()`: saves a new user to the database
- `findAll()`: gets all users
- `findOne(id)`: gets a specific user by ID
- `update(id, data)`: changes user information
- `remove(id)`: deletes a user

---

### `backend/src/projects/*` (project management)
These files handle project operations.

#### `projects.controller.ts`
**What it is:** where the URL routes live.

Examples:
- `POST /projects` — create a new project
- `GET /projects` — get all projects
- `GET /projects/:id` — get one specific project
- `PATCH /projects/:id` — update a project
- `DELETE /projects/:id` — delete a project

#### `projects.service.ts`
**What it is:** the "business logic" for projects.

Similar to users, but for projects. When you fetch a project, it automatically includes all its tasks (because of the `relations` setting).

---

### `backend/src/tasks/*` (task management)
These files handle task operations.

#### `tasks.controller.ts`
**What it is:** where the URL routes live.

Examples:
- `POST /tasks` — create a new task
- `GET /tasks` — get all tasks
- `GET /tasks/:id` — get one specific task
- `GET /tasks/project/:projectId` — get all tasks for a specific project
- `PATCH /tasks/:id` — update a task (e.g., change status)
- `DELETE /tasks/:id` — delete a task

#### `tasks.service.ts`
**What it is:** the "business logic" for tasks.

**Important method:**
```typescript
async findByProject(projectId: number): Promise<Task[]> {
  return await this.tasksRepository.find({ 
    where: { projectId }, 
    relations: ['user'] 
  });
}
```

**Beginner translation:**
"Get all tasks that belong to a specific project, and include who they're assigned to."

When updating a task:
```typescript
async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
  if (!updateTaskDto || Object.keys(updateTaskDto).length === 0) {
    throw new BadRequestException('Provide at least one field to update.');
  }
  // ... update logic
}
```

**Beginner translation:**
"Don't allow empty updates. You must change at least one field."

---

### `backend/src/*/dto/*.dto.ts` (validation rules)
**What DTOs are:** Data Transfer Objects = rules for what data is allowed.

Example from `create-task.dto.ts`:
```typescript
export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsDateString()
  deadline: string;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
```

**Beginner translation:**
"When someone tries to create a task, they MUST provide: a title (text), status (text), deadline (valid date format), projectId (number), and userId (number). If any are missing or wrong type, reject it."

This prevents:
- Creating tasks without deadlines
- Assigning tasks to non-existent users
- Saving incomplete data

---

## Frontend: purpose of the key files (website)

### `frontend/src/main.jsx`
**What it is:** the website start point.

It loads your main React component (`App.jsx`) into the page.

---

### `frontend/src/App.jsx`
**What it is:** the simple wrapper.

It just loads the `Dashboard` component. Very minimal — all the logic is in Dashboard.

---

### `frontend/src/components/Dashboard.jsx`
**What it is:** the entire user interface (the big one).

This is where all the magic happens. It's a long file (~466 lines) because it handles:

#### State Management (memory)
```javascript
const [projects, setProjects] = useState([]);
const [users, setUsers] = useState([]);
const [tasks, setTasks] = useState([]);
const [theme, setTheme] = useState(getInitialTheme());
const [showProjectForm, setShowProjectForm] = useState(false);
const [selectedProject, setSelectedProject] = useState(null);
```

**Beginner translation:**
The component remembers:
- All projects, users, and tasks
- Current theme (light/dark/system)
- Which forms are open
- Which project's tasks are being viewed

---

#### Loading Data
```javascript
const loadData = async () => {
  try {
    const [projectsRes, usersRes, tasksRes] = await Promise.all([
      api.getProjects(),
      api.getUsers(),
      api.getTasks()
    ]);
    setProjects(projectsRes.data);
    setUsers(usersRes.data);
    setTasks(tasksRes.data);
  } catch (error) {
    console.error('Error loading data:', error);
  }
};
```

**Beginner translation:**
`Promise.all()` asks for all three things at the same time (parallel requests) instead of waiting for each one. Faster loading!

---

#### Theme Toggle
```javascript
const cycleTheme = () => {
  setTheme((prev) => {
    if (prev === 'system') return 'light';
    if (prev === 'light') return 'dark';
    return 'system';
  });
};
```

**Beginner translation:**
Clicking the theme button cycles: System → Light → Dark → System

The theme is saved in `localStorage` so it remembers your preference when you return.

---

#### Progress Calculation
```javascript
const projectTasks = getProjectTasks(project.id);
const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
const percentage = (completedTasks / projectTasks.length) * 100;
```

**Beginner translation:**
For each project card:
1. Get all tasks for that project
2. Count how many are completed
3. Calculate percentage
4. Draw a progress bar

---

#### Status Color Coding
```javascript
const getStatusColor = (status) => {
  switch (status) {
    case 'todo': return '#e74c3c';        // Red
    case 'in-progress': return '#f39c12'; // Orange
    case 'completed': return '#27ae60';   // Green
    default: return '#95a5a6';            // Gray
  }
};
```

**Beginner translation:**
Tasks get colored backgrounds based on their status. Makes it easy to see at a glance.

---

#### Overdue Detection
```javascript
const isOverdue = (deadline) => {
  return new Date(deadline) < new Date() && 
         new Date(deadline).toDateString() !== new Date().toDateString();
};
```

**Beginner translation:**
A task is overdue if its deadline is before today (but not if it's exactly today).

---

#### Updating Task Status
```javascript
const handleUpdateTaskStatus = async (taskId, newStatus) => {
  try {
    await api.updateTask(taskId, { status: newStatus });
    loadData();
  } catch (error) {
    console.error('Error updating task:', error);
  }
};
```

**Beginner translation:**
When you change a task's status dropdown:
1. Send update to backend
2. Reload all data to show the change
3. Progress bars automatically update

---

### `frontend/src/services/api.js`
**What it is:** the "phone book" for talking to the backend.

It contains functions for every API endpoint:

**Users:**
- `getUsers()` → `GET /users`
- `createUser(data)` → `POST /users`
- `deleteUser(id)` → `DELETE /users/:id`

**Projects:**
- `getProjects()` → `GET /projects`
- `createProject(data)` → `POST /projects`
- `deleteProject(id)` → `DELETE /projects/:id`

**Tasks:**
- `getTasks()` → `GET /tasks`
- `createTask(data)` → `POST /tasks`
- `updateTask(id, data)` → `PATCH /tasks/:id` (for changing status)
- `deleteTask(id)` → `DELETE /tasks/:id`

**Setup:**
```javascript
const API_URL = 'http://localhost:3000';
```

All functions talk to this base URL.

---

## Common "important syntax" explained simply

### 1) NestJS decorators (labels above code)
In the backend, you'll see labels like:
- `@Controller('tasks')` — "this handles URLs starting with `/tasks`"
- `@Get()` — "this function runs for GET requests"
- `@Post()` — "this function runs for POST requests"
- `@Patch(':id')` — "this function runs for PATCH requests to update"
- `@Delete(':id')` — "this function runs for DELETE requests"

**Beginner translation:**
These are sticky notes that tell NestJS what each function does.

---

### 2) TypeORM decorators (database blueprints)
You'll see:
- `@Entity('tasks')` — "this class represents the tasks table"
- `@PrimaryGeneratedColumn()` — "this is the ID, auto-increment it"
- `@Column()` — "this is a column in the table"
- `@Column({ type: 'date' })` — "this column stores a date"
- `@OneToMany(...)` — "one project has many tasks"
- `@ManyToOne(...)` — "many tasks belong to one project/user"

**Beginner translation:**
These tell TypeORM how to create the database and how tables link together.

---

### 3) React state (`useState`) = memory for the screen
In the frontend you'll see:
```javascript
const [tasks, setTasks] = useState([]);
```

**Beginner translation:**
- `tasks` = current list of tasks (starts as empty array `[]`)
- `setTasks([...])` = update it with new data, and React refreshes the screen automatically

---

### 4) React effects (`useEffect`) = "run this when something changes"
You'll see:
```javascript
useEffect(() => {
  loadData();
}, []);
```

**Beginner translation:**
"When the component first loads (empty `[]` means 'once'), run `loadData()`."

Another example:
```javascript
useEffect(() => {
  applyTheme(theme);
  localStorage.setItem('flowdesk-theme', theme);
}, [theme]);
```

**Beginner translation:**
"Whenever `theme` changes, apply it to the page and save it to browser storage."

---

### 5) Promise.all (parallel requests)
You'll see:
```javascript
const [projectsRes, usersRes, tasksRes] = await Promise.all([
  api.getProjects(),
  api.getUsers(),
  api.getTasks()
]);
```

**Beginner translation:**
Instead of waiting for each request one-by-one:
- Request 1 → wait → Request 2 → wait → Request 3 ❌ SLOW

Do all at once:
- Request 1, 2, 3 all at the same time → wait for all ✅ FAST

---

## Database structure (simplified)

Think of the database as three Excel spreadsheets:

### Sheet 1: users
| id | name | email |
|----|------|-------|
| 1 | Sarah Chen | sarah@example.com |
| 2 | Mike Johnson | mike@example.com |
| 3 | Lisa Park | lisa@example.com |

### Sheet 2: projects
| id | name | description | startDate | endDate |
|----|------|-------------|-----------|---------|
| 1 | Website Redesign | Update company site | 2026-01-01 | 2026-03-31 |
| 2 | Mobile App | Build iOS/Android app | 2026-02-01 | 2026-06-30 |

### Sheet 3: tasks
| id | title | description | status | deadline | projectId | userId |
|----|-------|-------------|--------|----------|-----------|--------|
| 1 | Design homepage | Create mockup | completed | 2026-01-15 | 1 | 1 |
| 2 | Write code | Build frontend | in-progress | 2026-02-01 | 1 | 2 |
| 3 | Setup database | Configure DB | todo | 2026-02-15 | 2 | 3 |

**The connections:**
- Task #1 belongs to Project #1 (Website Redesign) via `projectId = 1`
- Task #1 is assigned to User #1 (Sarah) via `userId = 1`
- Task #2 belongs to Project #1, assigned to User #2 (Mike)
- Task #3 belongs to Project #2 (Mobile App), assigned to User #3 (Lisa)

**Cascade deletes:**
- If you delete Project #1, Tasks #1 and #2 automatically delete
- If you delete User #1 (Sarah), Task #1 stays but `userId` might be set to null (depends on implementation)

---

## Key features explained

### 1) Dashboard Statistics
At the top of the page, you see:
- **Total Projects**: counts rows in projects table
- **Total Tasks**: counts rows in tasks table
- **Completed Tasks**: counts tasks where `status = 'completed'`
- **Team Members**: counts rows in users table

These update automatically whenever you add/delete anything.

---

### 2) Project Progress Bars
For each project card:
1. Filters tasks to get only those for this project
2. Counts how many have `status = 'completed'`
3. Calculates percentage
4. Displays a colored bar that fills based on completion

Example:
- Project has 8 tasks
- 6 are completed
- Progress: 6/8 = 75%
- Bar is 75% filled (green)

---

### 3) Task Status Dropdown
Each task has a `<select>` dropdown:
```jsx
<select 
  value={task.status}
  onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
  style={{ backgroundColor: getStatusColor(task.status) }}
>
  <option value="todo">To Do</option>
  <option value="in-progress">In Progress</option>
  <option value="completed">Completed</option>
</select>
```

**What happens:**
1. You select a new status
2. Frontend sends `PATCH /tasks/:id` with `{ status: 'completed' }`
3. Backend updates the database
4. Frontend reloads all data
5. Progress bars update automatically
6. Dropdown color changes

---

### 4) Overdue Alerts
When displaying a task's deadline:
```jsx
<span className={`task-deadline ${isOverdue(task.deadline) ? 'overdue' : ''}`}>
  📅 {task.deadline}
  {isOverdue(task.deadline) && ' (Overdue!)'}
</span>
```

**What happens:**
- If deadline is past: shows in red with "(Overdue!)" text
- If deadline is today or future: shows normally

---

### 5) Theme Toggle (Light/Dark Mode)
**How it works:**
1. Clicks the theme button
2. Cycles through: System → Light → Dark → System
3. Saves preference to `localStorage`
4. Applies CSS classes to the page
5. Next visit: remembers your choice

**Implementation:**
```javascript
function applyTheme(theme) {
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme');
    return;
  }
  document.documentElement.setAttribute('data-theme', theme);
}
```

CSS uses `[data-theme="dark"]` and `[data-theme="light"]` selectors to style differently.

---

## Security details

### CORS (Cross-Origin Resource Sharing)
**What it is:** Browser security that blocks different origins from talking.

**The problem:**
- Frontend runs on `http://localhost:5173` (origin A)
- Backend runs on `http://localhost:3000` (origin B)
- Browser says: "These are different! Block it!"

**The solution:**
```typescript
app.enableCors();
```

**What this does:**
Tells the backend: "Accept requests from any origin."

**Real-world analogy:**
- Without CORS: A gated community that only lets residents in
- With `enableCors()`: The gate is open to everyone

**Production note:**
In a real app, you'd restrict it:
```typescript
app.enableCors({
  origin: 'https://yourcompany.com',
});
```

But for local development, wide-open is fine.

---

### Why no authentication?
This app has **no login system** because:
- It's a learning project focused on CRUD and relationships
- Anyone can create/edit/delete projects, tasks, and users
- No concept of "my tasks" vs "their tasks"

**What authentication would add:**
- Users would log in
- Only see/edit their own assigned tasks
- Managers could see all tasks
- JWT tokens for session management

**Why Activity 7 doesn't need it:**
The focus is on:
- **Complex relationships** (users ↔ tasks ↔ projects)
- **Progress tracking**
- **Status management**
- **Multiple entities**

Not on security/permissions.

---

## Validation explained

### Backend validation
Uses `class-validator` decorators:

```typescript
export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
```

**What happens:**
- If someone sends a project without a start date → rejected
- If someone sends invalid date format → rejected
- If someone sends empty name → rejected

### Frontend validation
Uses HTML5 validation:

```jsx
<input
  type="text"
  required
  placeholder="Project name"
/>

<input
  type="date"
  required
/>
```

**Beginner translation:**
Double validation (frontend + backend) ensures bad data never reaches the database.

---

## Quick mental model for your presentation

If someone asks "how does it work?" you can say:

### Simple version (30 seconds):
1. **Dashboard loads** → asks backend for all projects, users, and tasks
2. **Backend queries database** → returns everything
3. **Frontend displays** → shows project cards with progress bars
4. **User creates task** → assigns it to a project and person
5. **Progress updates** → automatically tracks completion percentage

### Detailed version (2 minutes):
1. **User opens website** → frontend loads, requests all data in parallel
2. **Backend fetches** → gets projects, users, and tasks from SQLite database
3. **Frontend calculates** → for each project, computes how many tasks are done
4. **User creates project/task** → fills form, frontend validates, sends to backend
5. **Backend saves** → links tasks to projects and users via foreign keys
6. **User changes task status** → dropdown triggers update request
7. **Progress bars update** → frontend recalculates completion percentages
8. **Overdue detection** → frontend checks if deadline < today, shows warning

### Technical version (for instructors):
- **Architecture**: RESTful API with NestJS backend + React frontend
- **Database**: SQLite with TypeORM (complex relationships: one-to-many, many-to-one)
- **Relationships**: Projects have many Tasks, Users have many Tasks, Tasks belong to both
- **Communication**: HTTP requests via Axios (no real-time, standard REST)
- **Validation**: DTO classes with decorators (backend) + HTML5 validation (frontend)
- **CORS**: Enabled for cross-origin requests (localhost:5173 ↔ localhost:3000)
- **Features**: Progress tracking, status management, overdue alerts, theme toggle
- **No auth**: Open system, no user sessions or permissions

---

## Common questions answered

### Q: What happens if I delete a project?
**A:**
1. Frontend sends `DELETE /projects/:id`
2. Backend finds the project
3. Because of `cascade: ['remove']`, all tasks belonging to that project automatically delete
4. Project and its tasks are removed from database
5. Frontend refreshes, project card disappears

---

### Q: What happens if I delete a user?
**A:**
1. Frontend sends `DELETE /users/:id`
2. Backend finds the user
3. Because of `cascade: ['remove']` on tasks relationship:
   - Tasks assigned to that user might remain (depending on implementation)
   - Or they might be deleted (if cascade is set to full delete)
4. In this app, tasks stay but lose their user assignment

---

### Q: How does the progress bar know to update?
**A:**
When you change a task's status:
1. Frontend sends update to backend
2. Backend saves the new status
3. Frontend calls `loadData()` which fetches everything again
4. React re-renders the component
5. `getProjectTasks()` recounts completed tasks
6. Progress percentage recalculates
7. Progress bar redraws with new width

---

### Q: Can two people use this at the same time?
**A:**
Yes, but with limitations:
- Multiple people can view and edit simultaneously
- BUT: Changes don't appear in real-time for others
- Each person needs to refresh their browser to see updates
- No conflict resolution (last write wins)

For real-time updates, you'd need WebSocket (like Activity 8).

---

### Q: Where is the data stored?
**A:**
In a file called `database.sqlite` in the `backend/` folder.

It's a binary file containing three tables (users, projects, tasks). If you delete this file, all data is lost. If you copy it, you copy all the data.

---

## Final summary

**Activity 7 is a task management system that demonstrates:**

1. ✅ **Full-stack development**: Separate backend (NestJS) and frontend (React)
2. ✅ **RESTful API**: Standard HTTP requests for CRUD operations
3. ✅ **Complex relationships**: Multiple entities with foreign keys (projects ↔ tasks ↔ users)
4. ✅ **Progress tracking**: Automatic calculation of completion percentages
5. ✅ **Status management**: Dropdown to change task states (To Do / In Progress / Completed)
6. ✅ **Deadline monitoring**: Overdue alerts for late tasks
7. ✅ **Theme toggle**: Light/Dark/System mode with localStorage persistence
8. ✅ **Data validation**: Both frontend and backend check for valid input
9. ✅ **CORS**: Enables cross-origin communication
10. ❌ **No real-time**: Uses standard HTTP, not WebSocket
11. ❌ **No authentication**: Open system, no user accounts or permissions
