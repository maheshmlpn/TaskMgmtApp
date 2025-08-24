import React from 'react';
import { TaskItem } from '../types';

interface TaskListProps {
  tasks: TaskItem[];
  onEdit: (task: TaskItem) => void;
  onDelete: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  return (
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
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <div>
                      <div className="fw-medium">{task.title}</div>
                      <small className="text-muted">{task.description}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
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
                      onClick={() => onEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={() => onDelete(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-primary';
    case 'InProgress': return 'bg-warning text-dark';
    case 'Testing': return 'bg-info';
    case 'Completed': return 'bg-success';
    case 'Closed': return 'bg-secondary';
    default: return 'bg-secondary';
  }
};

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-danger';
    case 'Medium': return 'bg-warning text-dark';
    case 'Low': return 'bg-success';
    case 'Critical': return 'bg-dark';
    default: return 'bg-secondary';
  }
};

export default TaskList;