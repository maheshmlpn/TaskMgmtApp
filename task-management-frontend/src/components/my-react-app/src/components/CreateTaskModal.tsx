import React, { useState } from 'react';
import { User } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onCreateTask: (task: {
    title: string;
    description: string;
    priority: string;
    groupId: number;
    dueDate: string;
    assignedToId: number | null;
  }) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, users, onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [groupId, setGroupId] = useState(1);
  const [dueDate, setDueDate] = useState('');
  const [assignedToId, setAssignedToId] = useState<number | null>(null);

  const handleSubmit = () => {
    onCreateTask({ title, description, priority, groupId, dueDate, assignedToId });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Task</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Task Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
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
                value={groupId}
                onChange={(e) => setGroupId(Number(e.target.value))}
              >
                {/* Options for groups should be populated here */}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Assign To</label>
              <select
                className="form-select"
                value={assignedToId || ''}
                onChange={(e) => setAssignedToId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={!title}>
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;