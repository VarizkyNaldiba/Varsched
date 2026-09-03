import React, { useState, useEffect } from 'react';
import { BarChart, Activity, CheckCircle, Flame } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    streak: 0,
  });

  useEffect(() => {
    // In a real app, this would fetch from localStorage or an API
    const tasks = JSON.parse(localStorage.getItem('varsched-tasks')) || [];
    const completed = tasks.filter(t => t.status === 'done').length;
    const pending = tasks.filter(t => t.status !== 'done').length;
    const streak = parseInt(localStorage.getItem('varsched-streak') || '0', 10);
    
    setStats({ completed, pending, streak });
  }, []);

  return (
    <div className="animate-fade-in dashboard-container">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Welcome back! Here's your productivity overview.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Completed Tasks</h3>
            <p className="stat-value">{stats.completed}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <h3>Pending Tasks</h3>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-color)' }}>
            <Flame size={24} />
          </div>
          <div className="stat-content">
            <h3>Current Streak</h3>
            <p className="stat-value">{stats.streak} Days</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-placeholder glass-panel">
          <div className="chart-header">
            <h3>Productivity Trends</h3>
            <BarChart size={20} className="text-secondary" />
          </div>
          <div className="chart-body">
            <div className="bars">
              {/* Dummy chart bars */}
              {[40, 70, 45, 90, 60, 80, 50].map((height, i) => (
                <div key={i} className="bar-wrapper">
                  <div className="bar" style={{ height: `${height}%` }}></div>
                  <span>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="recent-activity glass-panel">
          <h3>Habit Tracker</h3>
          <div className="habit-list">
            <div className="habit-item">
              <span className="habit-name">Read 30 mins</span>
              <div className="habit-days">
                {[1,1,1,0,1,1,0].map((done, i) => (
                  <div key={i} className={`habit-day ${done ? 'done' : ''}`}></div>
                ))}
              </div>
            </div>
            <div className="habit-item">
              <span className="habit-name">Workout</span>
              <div className="habit-days">
                {[0,1,0,1,1,0,0].map((done, i) => (
                  <div key={i} className={`habit-day ${done ? 'done' : ''}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
