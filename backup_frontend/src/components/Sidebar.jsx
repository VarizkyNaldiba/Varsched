import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, Timer, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>⏱️ Varsched</h2>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/tasks" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <CheckSquare size={20} />
          <span>Tasks & Kanban</span>
        </NavLink>
        <NavLink to="/calendar" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Calendar size={20} />
          <span>Calendar</span>
        </NavLink>
        <NavLink to="/pomodoro" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Timer size={20} />
          <span>Pomodoro</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
