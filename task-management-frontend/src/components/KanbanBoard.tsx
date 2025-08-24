import React from 'react';
import { TaskItem } from '../types';

interface KanbanBoardProps {
  tasks: TaskItem[];
  onTaskUpdate: (taskId: number, newStatus: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskUpdate }) => {
  const statusColumns = ['Open', 'InProgress', 'Testing', 'Completed', 'Closed'];

  const handleDrop = (taskId: number, newStatus: string) => {
    onTaskUpdate(taskId, newStatus);
  };

  return (
    <div className="row g-3">
      {statusColumns.map(status => (
        <div key={status} className="col">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">{status}</h5>
              <span className="badge bg-primary">
                {tasks.filter(task => task.status === status).length}
              </span>
            </div>
            <div className="card-body">
              <div className="d-grid gap-3">
                {tasks
                  .filter(task => task.status === status)
                  .map(task => (
                    <div
                      key={task.id}
                      className="card border"
                      draggable
                      onDragEnd={() => handleDrop(task.id, status)}
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
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;