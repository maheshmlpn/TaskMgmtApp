import React from 'react';
import { TaskItem, User } from '../types';

interface TaskDetailModalProps {
  task: TaskItem | null;
  users: User[];
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
  onAssignTask: (userId: number) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, users, onClose, onUpdateStatus, onAssignTask }) => {
  if (!task) return null;

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{task.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="text-muted">{task.description}</p>
            <div className="row mb-3">
              <div className="col-6">
                <span className={`badge ${task.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                  {task.status}
                </span>
                <span className={`badge ${task.priority === 'High' ? 'bg-danger' : 'bg-secondary'}`}>
                  {task.priority}
                </span>
              </div>
            </div>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <strong>Created by:</strong> {task.createdByName}
              </div>
              <div className="col-md-6">
                <strong>Assigned to:</strong> {task.assignedToName || 'Unassigned'}
              </div>
              <div className="col-md-6">
                <strong>Group:</strong> {task.groupName}
              </div>
              <div className="col-md-6">
                <strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Update Status:</label>
                <select className="form-select" value={task.status} onChange={(e) => onUpdateStatus(e.target.value)}>
                  <option value="Open">Open</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Testing">Testing</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Assign to:</label>
                <select className="form-select" value={task.assignedToId || ''} onChange={(e) => e.target.value && onAssignTask(Number(e.target.value))}>
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;