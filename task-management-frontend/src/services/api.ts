import { 
  TaskItem, 
  User, 
  Group, 
  CreateTaskDto, 
  UpdateTaskDto, 
  UpdateTaskStatusDto, 
  CreateCommentDto,
  CreateGroupDto 
} from '../types';

const API_BASE_URL = 'https://localhost:7000/api'; // Adjust to your backend URL

// Generic fetch wrapper
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Task API functions
export const taskApi = {
  // Get all tasks
  getTasks: (): Promise<TaskItem[]> => 
    apiCall('/tasks'),

  // Get task by ID
  getTask: (id: number): Promise<TaskItem> => 
    apiCall(`/tasks/${id}`),

  // Create new task
  createTask: (task: CreateTaskDto): Promise<TaskItem> => 
    apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),

  // Update task
  updateTask: (id: number, task: UpdateTaskDto): Promise<void> => 
    apiCall(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    }),

  // Update task status
  updateTaskStatus: (id: number, statusUpdate: UpdateTaskStatusDto): Promise<void> => 
    apiCall(`/tasks/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusUpdate),
    }),

  // Add comment to task
  addComment: (id: number, comment: CreateCommentDto): Promise<any> => 
    apiCall(`/tasks/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    }),

  // Get tasks by group
  getTasksByGroup: (groupId: number): Promise<TaskItem[]> => 
    apiCall(`/tasks/group/${groupId}`),
};

// User API functions
export const userApi = {
  // Get all users
  getUsers: (): Promise<User[]> => 
    apiCall('/users'),

  // Get user by ID
  getUser: (id: number): Promise<User> => 
    apiCall(`/users/${id}`),
};

// Group API functions
export const groupApi = {
  // Get all groups
  getGroups: (): Promise<Group[]> => 
    apiCall('/groups'),

  // Get group by ID
  getGroup: (id: number): Promise<Group> => 
    apiCall(`/groups/${id}`),

  // Create new group
  createGroup: (group: CreateGroupDto): Promise<Group> => 
    apiCall('/groups', {
      method: 'POST',
      body: JSON.stringify(group),
    }),

  // Get group members
  getGroupMembers: (id: number): Promise<User[]> => 
    apiCall(`/groups/${id}/members`),

  // Add member to group
  addMemberToGroup: (groupId: number, userId: number): Promise<void> => 
    apiCall(`/groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default {
  taskApi,
  userApi,
  groupApi,
  handleApiError,
};