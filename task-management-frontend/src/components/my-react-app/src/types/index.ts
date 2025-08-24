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

export interface TaskComment {
  id: number;
  comment: string;
  userName: string;
  createdDate: string;
}

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: 'Open' | 'InProgress' | 'Testing' | 'Completed' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdById: number;
  createdByName: string;
  assignedToId: number | null;
  assignedToName: string | null;
  groupId: number;
  groupName: string;
  createdDate: string;
  dueDate: string | null;
  lastUpdated: string;
  comments?: TaskComment[];
}