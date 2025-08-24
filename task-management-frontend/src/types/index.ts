export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'User';
}

export interface Group {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerName: string;
  members: User[];
}

export interface GroupTasks extends Group {
  tasks: TaskItem[];
}

export interface TaskComment {
  id: number;
  comment: string;
  userName: string;
  createdDate: string;
}

export interface CreateGroupDto {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerName: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string; // ISO date string
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface UpdateTaskStatusDto {
  status: string;
  comment?: string; // Optional comment when changing status
}

export interface CreateCommentDto {
  taskId: string;
  content: string;
}

// DTO Interfaces for API requests
export interface CreateTaskDto {
  title: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string; // ISO date string format: "2024-12-31T23:59:59.000Z"
  tags?: string[];
  estimatedHours?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string; // ISO date string
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

// Enums for better type safety
export enum TaskStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'InProgress',
  TESTING = 'Testing',
  COMPLETED = 'Completed',
  CLOSED = 'Closed'
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdById: number;
  createdByName: string;
  assignedToId: number | null;
  assignedToName: string | undefined;
  groupId: number;
  groupName: string;
  createdDate: string;
  dueDate: string | null;
  lastUpdated: string;
  comments?: TaskComment[];
}