import React, { useState } from 'react';
import { User } from '../types';

interface CreateGroupModalProps {
  users: User[];
  onCreateGroup: (group: { name: string; description: string; ownerId: number }) => void;
  onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ users, onCreateGroup, onClose }) => {
  const [newGroup, setNewGroup] = useState({ name: '', description: '', ownerId: users[0]?.id || 1 });

  const handleSubmit = () => {
    if (newGroup.name) {
      onCreateGroup(newGroup);
      setNewGroup({ name: '', description: '', ownerId: users[0]?.id || 1 });
    }
  };

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Group</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
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
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={!newGroup.name}>
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;