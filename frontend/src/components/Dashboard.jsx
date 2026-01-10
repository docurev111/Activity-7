import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './Dashboard.css';

function getInitialTheme() {
  const saved = localStorage.getItem('flowdesk-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'system';
}

function applyTheme(theme) {
  // theme: 'light' | 'dark' | 'system'
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme');
    return;
  }
  document.documentElement.setAttribute('data-theme', theme);
}

function Dashboard() {
  const [theme, setTheme] = useState(getInitialTheme());
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    deadline: '',
    projectId: '',
    userId: ''
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('flowdesk-theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => {
      if (prev === 'system') return 'light';
      if (prev === 'light') return 'dark';
      return 'system';
    });
  };

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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.createProject(projectForm);
      setShowProjectForm(false);
      setProjectForm({ name: '', description: '', startDate: '', endDate: '' });
      loadData();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.createTask({
        ...taskForm,
        projectId: Number(taskForm.projectId),
        userId: Number(taskForm.userId)
      });
      setShowTaskForm(false);
      setTaskForm({ title: '', description: '', status: 'todo', deadline: '', projectId: '', userId: '' });
      loadData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.createUser(userForm);
      setShowUserForm(false);
      setUserForm({ name: '', email: '' });
      loadData();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.deleteProject(id);
        loadData();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(id);
        loadData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getProjectTasks = (projectId) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#e74c3c';
      case 'in-progress': return '#f39c12';
      case 'completed': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="brand">
          <h1>Flowdesk</h1>
          <p className="brand-subtitle">Projects, tasks, and deadlines—kept simple.</p>
        </div>
        <div className="header-buttons">
          <button onClick={cycleTheme} className="btn btn-ghost" title="Toggle theme">
            {theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'}
          </button>
          <button onClick={() => setShowUserForm(true)} className="btn btn-primary">
            + Add User
          </button>
          <button onClick={() => setShowProjectForm(true)} className="btn btn-primary">
            + Add Project
          </button>
          <button onClick={() => setShowTaskForm(true)} className="btn btn-primary">
            + Add Task
          </button>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{projects.length}</h3>
          <p>Total Projects</p>
        </div>
        <div className="stat-card">
          <h3>{tasks.length}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{tasks.filter(t => t.status === 'completed').length}</h3>
          <p>Completed Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{users.length}</h3>
          <p>Team Members</p>
        </div>
      </div>

      <div className="projects-section">
        <h2>Projects</h2>
        <div className="projects-grid">
          {projects.map(project => {
            const projectTasks = getProjectTasks(project.id);
            const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
            return (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="btn-delete"
                  >
                    
                  </button>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-dates">
                  <span> {project.startDate} to {project.endDate}</span>
                </div>
                <div className="project-progress">
                  <div className="progress-text">
                    {completedTasks} / {projectTasks.length} tasks completed
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `%` }}
                    ></div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProject(project.id === selectedProject ? null : project.id)}
                  className="btn btn-secondary"
                >
                  {selectedProject === project.id ? 'Hide Tasks' : 'View Tasks'}
                </button>
                
                {selectedProject === project.id && (
                  <div className="tasks-list">
                    {projectTasks.length === 0 ? (
                      <p className="no-tasks">No tasks yet</p>
                    ) : (
                      projectTasks.map(task => {
                        const taskUser = users.find(u => u.id === task.userId);
                        return (
                          <div key={task.id} className="task-item">
                            <div className="task-header">
                              <h4>{task.title}</h4>
                              <button 
                                onClick={() => handleDeleteTask(task.id)}
                                className="btn-delete-small"
                              >
                                
                              </button>
                            </div>
                            <p className="task-description">{task.description}</p>
                            <div className="task-meta">
                              <span className="task-user"> {taskUser?.name || 'Unknown'}</span>
                              <span className={`task-deadline `}>
                                 {task.deadline}
                                {isOverdue(task.deadline) && ' (Overdue!)'}
                              </span>
                            </div>
                            <div className="task-status">
                              <select 
                                value={task.status}
                                onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                                style={{ backgroundColor: getStatusColor(task.status) }}
                              >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add User Modal */}
      {showUserForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New User</h2>
              <button onClick={() => setShowUserForm(false)} className="btn-close"></button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Create User</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showProjectForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Project</h2>
              <button onClick={() => setShowProjectForm(false)} className="btn-close"></button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={projectForm.startDate}
                  onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={projectForm.endDate}
                  onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Create Project</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showTaskForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button onClick={() => setShowTaskForm(false)} className="btn-close"></button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Project</label>
                <select
                  value={taskForm.projectId}
                  onChange={(e) => setTaskForm({...taskForm, projectId: e.target.value})}
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Assigned To</label>
                <select
                  value={taskForm.userId}
                  onChange={(e) => setTaskForm({...taskForm, userId: e.target.value})}
                  required
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({...taskForm, deadline: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Create Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
