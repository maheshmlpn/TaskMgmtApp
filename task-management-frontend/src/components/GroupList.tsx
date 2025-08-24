import React from 'react';
import { Group, GroupTasks } from '../types';

interface GroupListProps {
  groups: GroupTasks[];
}

const GroupList: React.FC<GroupListProps> = ({ groups }) => {
  return (
    <div className="group-list">
      <h2>Groups</h2>
      <ul className="list-group">
        {groups.map(group => (
          <li key={group.id} className="list-group-item">
            <h5>{group.name}</h5>
            <p>{group.description}</p>
            <small>Tasks: {group.tasks.length}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;