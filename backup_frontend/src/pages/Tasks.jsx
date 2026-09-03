import React, { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2, Check, Clock } from 'lucide-react';
import './Tasks.css';

const initialTasks = [
  { id: '1', title: 'Design UI mockup', status: 'todo', priority: 'high', deadline: '2026-09-05' },
  { id: '2', title: 'Write frontend logic', status: 'in-progress', priority: 'medium', deadline: '2026-09-10' },
  { id: '3', title: 'Setup database', status: 'done', priority: 'low', deadline: '2026-09-01' }
];

const Tasks = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('varsched-tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    localStorage.setItem('varsched-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: newTaskText,
      status: 'todo',
      priority: 'medium',
      deadline: ''
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const updateStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  return (
    <div className="animate-fade-in tasks-container">
      <header className="page-header">
        <h1>Tasks & Kanban</h1>
        <p className="subtitle">Manage your daily priorities effortlessly.</p>
      </header>

      <form className="add-task-form glass-panel" onSubmit={addTask}>
        <div className="input-group" style={{ margin: 0, flex: 1, flexDirection: 'row' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="What needs to be done?" 
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-primary">
            <Plus size={20} /> Add Task
          </button>
        </div>
      </form>

      <div className="kanban-board">
        {columns.map(column => (
          <div key={column.id} className="kanban-column glass-panel">
            <h3 className="column-title">
              {column.title} 
              <span className="task-count">{tasks.filter(t => t.status === column.id).length}</span>
            </h3>
            
            <div className="task-list">
              {tasks.filter(t => t.status === column.id).map(task => (
                <div key={task.id} className={`task-card ${task.priority}`}>
                  <div className="task-drag-handle">
                    <GripVertical size={16} />
                  </div>
                  <div className="task-content">
                    <h4>{task.title}</h4>
                    {task.deadline && (
                      <div className="task-meta">
                        <Clock size={14} /> {task.deadline}
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    {column.id !== 'done' && (
                      <button className="btn-icon" onClick={() => updateStatus(task.id, 'done')}>
                        <Check size={18} />
                      </button>
                    )}
                    {column.id === 'done' && (
                      <button className="btn-icon" onClick={() => updateStatus(task.id, 'todo')}>
                        <Clock size={18} />
                      </button>
                    )}
                    <button className="btn-icon text-danger" onClick={() => deleteTask(task.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
