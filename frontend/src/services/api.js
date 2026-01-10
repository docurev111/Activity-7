import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const api = {
  // Users
  getUsers: () => axios.get(`${API_URL}/users`),
  getUser: (id) => axios.get(`${API_URL}/users/${id}`),
  createUser: (data) => axios.post(`${API_URL}/users`, data),
  updateUser: (id, data) => axios.patch(`${API_URL}/users/${id}`, data),
  deleteUser: (id) => axios.delete(`${API_URL}/users/${id}`),

  // Projects
  getProjects: () => axios.get(`${API_URL}/projects`),
  getProject: (id) => axios.get(`${API_URL}/projects/${id}`),
  createProject: (data) => axios.post(`${API_URL}/projects`, data),
  updateProject: (id, data) => axios.patch(`${API_URL}/projects/${id}`, data),
  deleteProject: (id) => axios.delete(`${API_URL}/projects/${id}`),

  // Tasks
  getTasks: () => axios.get(`${API_URL}/tasks`),
  getTask: (id) => axios.get(`${API_URL}/tasks/${id}`),
  getTasksByProject: (projectId) => axios.get(`${API_URL}/tasks/project/${projectId}`),
  createTask: (data) => axios.post(`${API_URL}/tasks`, data),
  updateTask: (id, data) => axios.patch(`${API_URL}/tasks/${id}`, data),
  deleteTask: (id) => axios.delete(`${API_URL}/tasks/${id}`),
};
