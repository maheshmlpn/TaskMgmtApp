import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskManagementDashboard from "./components/TaskManagementDashboard";
import TaskList from "./components/TaskList";
import KanbanBoard from "./components/KanbanBoard";
import GroupList from "./components/GroupList";
import { TaskItem } from "./types";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskManagementDashboard />} />
        <Route
          path="/tasks"
          element={
            <TaskList
              tasks={[]}
              onEdit={function (task: TaskItem): void {
                throw new Error("Function not implemented.");
              }}
              onDelete={function (taskId: number): void {
                throw new Error("Function not implemented.");
              }}
            />
          }
        />
        <Route
          path="/kanban"
          element={
            <KanbanBoard
              tasks={[]}
              onTaskUpdate={function (taskId: number, newStatus: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          }
        />
        <Route path="/groups" element={<GroupList groups={[]} />} />
      </Routes>
    </Router>
  );
};

export default App;
