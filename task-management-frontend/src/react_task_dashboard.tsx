import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, CheckSquare, Users, MessageCircle } from 'lucide-react';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Group {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerName: string;
  members: User[];
}

interface TaskItem {
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

interface TaskComment {
  id: number;
  comment: string;
  userName: string;
  createdDate: string;
}

const TaskManagementDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    groupId: 1,
    dueDate: ''
  });
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    ownerId: 1
  });
  const [newComment, setNewComment] = useState('');

  // Mock data - replace with API calls
  const mockUsers: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@company.com', role: 'Admin' },
    { id: 2, name: 'John Manager', email: 'john@company.com', role: 'Manager' },
    { id: 3, name: 'Jane Developer', email: 'jane@company.com', role: 'User' },
    { id: 4, name: 'Bob Tester', email: 'bob@company.com', role: 'User' }
  ];

  const mockGroups: Group[] = [
    {
      id: 1,
      name: 'Development Team',
      description: 'Main development team',
      ownerId: 2,
      ownerName: 'John Manager',
      members: mockUsers.slice(1, 3)
    },
    {
      id: 2,
      name: 'QA Team',
      description: 'Quality Assurance team',
      ownerId: 2,
      ownerName: 'John Manager',
      members: [mockUsers[3]]
    }
  ];

  const mockTasks: TaskItem[] = [
    {
      id: 1,
      title: 'Implement user authentication',
      description: 'Add login and registration functionality',
      status: 'InProgress',
      priority: 'High',
      createdById: 2,
      createdByName: 'John Manager',
      assignedToId: 3,
      assignedToName: 'Jane Developer',
      groupId: 1,
      groupName: 'Development Team',
      createdDate: '2024-01-15T10:00:00Z',
      dueDate: '2024-01-25T17:00:00Z',
      lastUpdated: '2024-01-20T14:30:00Z',
      comments: [
        {
          id: 1,
          comment: 'Started working on the login form',
          userName: 'Jane Developer',
          createdDate: '2024-01-20T14:30:00Z'
        }
      ]
    },
    {
      id: 2,
      title: 'Write test cases for API',
      description: 'Create comprehensive test suite for REST API',
      status: 'Open',
      priority: 'Medium',
      createdById: 2,
      createdByName: 'John Manager',
      groupId: 2,
      groupName: 'QA Team',
      createdDate: '2024-01-16T09:00:00Z',
      dueDate: '2024-01-30T17:00:00Z',
      lastUpdated: '2024-01-16T09:00:00Z'
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
    setGroups(mockGroups);
    setTasks(mockTasks);
  }, []);

  const handleCreateTask = () => {
    const task: TaskItem = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      status: 'Open',
      priority: newTask.priority,
      createdById: 1,
      createdByName: 'Admin User',
      groupId: newTask.groupId,
      groupName: groups.find(g => g.id === newTask.groupId)?.name || '',
      createdDate: new Date().toISOString(),
      dueDate: newTask.dueDate || undefined,
      lastUpdated: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setOpenTaskDialog(false);
    setNewTask({ title: '', description: '', priority: 'Medium', groupId: 1, dueDate: '' });
  };

  const handleUpdateTaskStatus = (taskId: number, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, lastUpdated: new Date().toISOString() }
        : task
    ));
  };

  const handleAssignTask = (taskId: number, userId: number) => {
    const user = users.find(u => u.id === userId);
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            assignedToId: userId, 
            assignedToName: user?.name,
            lastUpdated: new Date().toISOString() 
          }
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Critical': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-blue-600 bg-blue-100';
      case 'InProgress': return 'text-orange-600 bg-orange-100';
      case 'Testing': return 'text-purple-600 bg-purple-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTasks = selectedGroup 
    ? tasks.filter(task => task.groupId === selectedGroup)
    : tasks;

  const statusColumns = ['Open', 'InProgress', 'Testing', 'Completed', 'Closed'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Task Management Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setOpenGroupDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users size={20} />
              New Group
            </button>
            <button
              onClick={() => setOpenTaskDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={20} />
              New Task
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-4 py-2 font-medium ${activeTab === 0 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`px-4 py-2 font-medium ${activeTab === 1 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Task List
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`px-4 py-2 font-medium ${activeTab === 2 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Groups
          </button>
        </div>

        {/* Group Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Group:</label>
          <select
            value={selectedGroup || ''}
            onChange={(e) => setSelectedGroup(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Groups</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>

        {/* Tab Content */}
        {activeTab === 0 && (
          /* Kanban Board */
          <div className="grid grid-cols-5 gap-4">
            {statusColumns.map(status => (
              <div key={status} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center justify-between">
                  {status}
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
                    {filteredTasks.filter(task => task.status === status).length}
                  </span>
                </h3>
                <div className="space-y-3">
                  {filteredTasks
                    .filter(task => task.status === status)
                    .map(task => (
                      <div
                        key={task.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.assignedToName && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <User size={12} />
                              {task.assignedToName}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {task.groupName}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 1 && (
          /* Task List View */
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500">{task.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {task.assignedToName || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{task.groupName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          /* Groups View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <div key={group.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                  <Users className="text-gray-400" size={20} />
                </div>
                <p className="text-gray-600 mb-4">{group.description}</p>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Owner: {group.ownerName}</p>
                  <p className="text-sm text-gray-500">Members: {group.members.length}</p>
                </div>
                <div className="space-y-2">
                  {group.members.map(member => (
                    <div key={member.id} className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-gray-400" />
                      <span>{member.name}</span>
                      <span className="text-gray-500">({member.role})</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Tasks: {tasks.filter(task => task.groupId === group.id).length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Task Dialog */}
        {openTaskDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Create New Task</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Task Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <select
                  value={newTask.groupId}
                  onChange={(e) => setNewTask({ ...newTask, groupId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpenTaskDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  disabled={!newTask.title}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Detail Dialog */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedTask.title}</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">{selectedTask.description}</p>
                <div className="flex gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Created by:</strong> {selectedTask.createdByName}
                  </div>
                  <div>
                    <strong>Assigned to:</strong> {selectedTask.assignedToName || 'Unassigned'}
                  </div>
                  <div>
                    <strong>Group:</strong> {selectedTask.groupName}
                  </div>
                  <div>
                    <strong>Due Date:</strong> {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'Not set'}
                  </div>
                </div>
                
                {/* Status Update */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status:</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleUpdateTaskStatus(selectedTask.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusColumns.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Assign Task */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign to:</label>
                  <select
                    value={selectedTask.assignedToId || ''}
                    onChange={(e) => e.target.value && handleAssignTask(selectedTask.id, Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {groups
                      .find(g => g.id === selectedTask.groupId)
                      ?.members.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Group Dialog */}
        {openGroupDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Create New Group</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Group Name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Group Description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <select
                  value={newGroup.ownerId}
                  onChange={(e) => setNewGroup({ ...newGroup, ownerId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {users.filter(user => user.role === 'Manager' || user.role === 'Admin').map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpenGroupDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const group: Group = {
                      id: groups.length + 1,
                      name: newGroup.name,
                      description: newGroup.description,
                      ownerId: newGroup.ownerId,
                      ownerName: users.find(u => u.id === newGroup.ownerId)?.name || '',
                      members: []
                    };
                    setGroups([...groups, group]);
                    setOpenGroupDialog(false);
                    setNewGroup({ name: '', description: '', ownerId: 1 });
                  }}
                  disabled={!newGroup.name}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagementDashboard;