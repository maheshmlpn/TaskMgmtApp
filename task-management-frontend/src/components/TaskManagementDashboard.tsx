import React, { useState, useEffect } from 'react';
import { Plus, Edit, User as UserIcon, Trash2, CheckSquare, Users, MessageCircle } from 'lucide-react';
import { User, Group, TaskItem, TaskComment } from '../types';

// API Configuration
const API_BASE_URL = 'https://localhost:7212/api';

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
    // setUsers(mockUsers);
    // setGroups(mockGroups);
    // setTasks(mockTasks);
    loadTasks();
    loadGroups();
    loadUsers();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Tasks`);
      if (response.ok) {
        const apiTasks = await response.json();
        setTasks(apiTasks);
      } else {
        console.error('Failed to load tasks, using mock data');
        setTasks(mockTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks(mockTasks);
    }
  };

  const loadGroups = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Groups`);
      if (response.ok) {
        const apiGroups = await response.json();
        setGroups(apiGroups);
      } else {
        console.error('Failed to load groups, using mock data');
        setGroups(mockGroups);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      setGroups(mockGroups);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Users`);
      if (response.ok) {
        const apiUsers = await response.json();
        setUsers(apiUsers);
      } else {
        console.error('Failed to load users, using mock data');
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers(mockUsers);
    }
  };

  const handleCreateTask = async () => {
      try {
      // Prepare the data for API call
      const createTaskDto = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        createdById: 1, // Replace with actual logged-in user ID
        groupId: newTask.groupId,
        dueDate: newTask.dueDate || null
      };

      // Call the API
      const response = await fetch(`${API_BASE_URL}/Tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createTaskDto)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdTask = await response.json();
      
      // Add the new task to the state
      setTasks([...tasks, createdTask]);
      
      // Close dialog and reset form
      setOpenTaskDialog(false);
      setNewTask({ title: '', description: '', priority: 'Medium', groupId: 1, dueDate: '' });
      
      // Optional: Show success message
      console.log('Task created successfully:', createdTask);
      
    } catch (error) {
      console.error('Error creating task:', error);
      // Optional: Show error message to user
      alert('Failed to create task. Please try again.');
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const updateStatusDto = {
        status: newStatus,
        updatedById: 1 // Replace with actual logged-in user ID
      };

      const response = await fetch(`${API_BASE_URL}/Tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateStatusDto)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, lastUpdated: new Date().toISOString() }
          : task
      ));

      console.log('Task status updated successfully');
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleAssignTask = async (taskId: number, userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) return;

      const updateTaskDto = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        assignedToId: userId,
        dueDate: task.dueDate,
        updatedById: 1 // Replace with actual logged-in user ID
      };

      const response = await fetch(`${API_BASE_URL}/Tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateTaskDto)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
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

      console.log('Task assigned successfully');
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Failed to assign task. Please try again.');
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High': return 'badge bg-danger';
      case 'Medium': return 'badge bg-warning text-dark';
      case 'Low': return 'badge bg-success';
      case 'Critical': return 'badge bg-dark';
      default: return 'badge bg-secondary';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open': return 'badge bg-primary';
      case 'InProgress': return 'badge bg-warning text-dark';
      case 'Testing': return 'badge bg-info';
      case 'Completed': return 'badge bg-success';
      case 'Closed': return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
  };

  const filteredTasks = selectedGroup 
    ? tasks.filter(task => task.groupId === selectedGroup)
    : tasks;

  const statusColumns = ['Open', 'InProgress', 'Testing', 'Completed', 'Closed'];

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container-xxl">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 mb-0">Task Management Dashboard</h1>
          <div className="btn-group" role="group">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setOpenGroupDialog(true)}
            >
              <Users size={20} className="me-2" />
              New Group
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setOpenTaskDialog(true)}
            >
              <Plus size={20} className="me-2" />
              New Task
            </button>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 0 ? 'active' : ''}`}
              onClick={() => setActiveTab(0)}
              type="button"
            >
              Kanban Board
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
              type="button"
            >
              Task List
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 2 ? 'active' : ''}`}
              onClick={() => setActiveTab(2)}
              type="button"
            >
              Groups
            </button>
          </li>
        </ul>

        {/* Group Filter */}
        <div className="mb-4">
          <label className="form-label">Filter by Group:</label>
          <select
            className="form-select"
            style={{ maxWidth: '300px' }}
            value={selectedGroup || ''}
            onChange={(e) => setSelectedGroup(e.target.value ? Number(e.target.value) : null)}
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
          <div className="row g-3">
            {statusColumns.map(status => (
              <div key={status} className="col">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{status}</h5>
                    <span className={getStatusBadgeClass(status)}>
                      {filteredTasks.filter(task => task.status === status).length}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-3">
                      {filteredTasks
                        .filter(task => task.status === status)
                        .map(task => (
                          <div
                            key={task.id}
                            className="card border"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedTask(task)}
                          >
                            <div className="card-body p-3">
                              <h6 className="card-title">{task.title}</h6>
                              <p className="card-text small text-muted" style={{ 
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {task.description}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className={getPriorityBadgeClass(task.priority)}>
                                  {task.priority}
                                </span>
                                {task.assignedToName && (
                                  <small className="text-muted d-flex align-items-center">
                                    <UserIcon size={12} className="me-1" />
                                    {task.assignedToName}
                                  </small>
                                )}
                              </div>
                              <small className="text-muted mt-2 d-block">
                                {task.groupName}
                              </small>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 1 && (
          /* Task List View */
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Task</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Assigned To</th>
                      <th>Group</th>
                      <th>Due Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map(task => (
                      <tr key={task.id}>
                        <td>
                          <div>
                            <div className="fw-medium">{task.title}</div>
                            <small className="text-muted">{task.description}</small>
                          </div>
                        </td>
                        <td>
                          <span className={getStatusBadgeClass(task.status)}>
                            {task.status}
                          </span>
                        </td>
                        <td>
                          <span className={getPriorityBadgeClass(task.priority)}>
                            {task.priority}
                          </span>
                        </td>
                        <td>{task.assignedToName || 'Unassigned'}</td>
                        <td>{task.groupName}</td>
                        <td>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedTask(task)}
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
          </div>
        )}

        {activeTab === 2 && (
          /* Groups View */
          <div className="row g-4">
            {groups.map(group => (
              <div key={group.id} className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{group.name}</h5>
                    <Users className="text-muted" size={20} />
                  </div>
                  <div className="card-body">
                    <p className="card-text">{group.description}</p>
                    <div className="mb-3">
                      <small className="text-muted d-block">Owner: {group.ownerName}</small>
                      <small className="text-muted">Members: {group.members.length}</small>
                    </div>
                    <div className="mb-3">
                      {group.members.map(member => (
                        <div key={member.id} className="d-flex align-items-center mb-2">
                          <UserIcon size={16} className="text-muted me-2" />
                          <span className="me-2">{member.name}</span>
                          <small className="text-muted">({member.role})</small>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card-footer text-muted">
                    <small>
                      Tasks: {tasks.filter(task => task.groupId === group.id).length}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Task Modal */}
        {openTaskDialog && (
          <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create New Task</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setOpenTaskDialog(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Task Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Enter task description"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Group</label>
                    <select
                      className="form-select"
                      value={newTask.groupId}
                      onChange={(e) => setNewTask({ ...newTask, groupId: Number(e.target.value) })}
                    >
                      {groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setOpenTaskDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCreateTask}
                    disabled={!newTask.title}
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Detail Modal */}
        {selectedTask && (
          <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedTask.title}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedTask(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted">{selectedTask.description}</p>
                  <div className="row mb-3">
                    <div className="col-6">
                      <span className={getStatusBadgeClass(selectedTask.status)} style={{ marginRight: '10px' }}>
                        {selectedTask.status}
                      </span>
                      <span className={getPriorityBadgeClass(selectedTask.priority)}>
                        {selectedTask.priority}
                      </span>
                    </div>
                  </div>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <strong>Created by:</strong> {selectedTask.createdByName}
                    </div>
                    <div className="col-md-6">
                      <strong>Assigned to:</strong> {selectedTask.assignedToName || 'Unassigned'}
                    </div>
                    <div className="col-md-6">
                      <strong>Group:</strong> {selectedTask.groupName}
                    </div>
                    <div className="col-md-6">
                      <strong>Due Date:</strong> {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'Not set'}
                    </div>
                  </div>
                  
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Update Status:</label>
                      <select
                        className="form-select"
                        value={selectedTask.status}
                        onChange={(e) => handleUpdateTaskStatus(selectedTask.id, e.target.value)}
                      >
                        {statusColumns.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Assign to:</label>
                      <select
                        className="form-select"
                        value={selectedTask.assignedToId || ''}
                        onChange={(e) => e.target.value && handleAssignTask(selectedTask.id, Number(e.target.value))}
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
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedTask(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Group Modal */}
        {openGroupDialog && (
          <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create New Group</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setOpenGroupDialog(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Group Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                      placeholder="Enter group name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                      placeholder="Enter group description"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Owner</label>
                    <select
                      className="form-select"
                      value={newGroup.ownerId}
                      onChange={(e) => setNewGroup({ ...newGroup, ownerId: Number(e.target.value) })}
                    >
                      {users.filter(user => user.role === 'Manager' || user.role === 'Admin').map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setOpenGroupDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
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
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagementDashboard;