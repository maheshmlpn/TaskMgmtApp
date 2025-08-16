// Enums (define first since they're used by interfaces)
export enum TaskStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Testing = 'Testing',
  Completed = 'Completed',
  Closed = 'Closed'
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Task comment interface
export interface TaskComment {
  id: number;
  comment: string;
  userName: string;
  createdDate: string;
}

// Group related types
export interface Group {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerName: string;
  members: User[];
}

// Task related types
export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdById: number;
  createdByName: string;
  assignedToId?: number;
  assignedToName?: string;
  groupId: number;
  groupName: string;
  createdDate: string;
  dueDate?: string;
  completedDate?: string;
  lastUpdated: string;
  comments?: TaskComment[];
}

// API DTOs
export interface CreateTaskDto {
  title: string;
  description: string;
  priority: string;
  createdById: number;
  groupId: number;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title: string;
  description: string;
  priority: string;
  assignedToId?: number;
  dueDate?: string;
  updatedById: number;
}

export interface UpdateTaskStatusDto {
  status: string;
  updatedById: number;
}

export interface CreateCommentDto {
  userId: number;
  comment: string;
}

export interface CreateGroupDto {
  name: string;
  description: string;
  ownerId: number;
}