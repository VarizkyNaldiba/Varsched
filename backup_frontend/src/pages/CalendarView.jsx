import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarView.css';

const CalendarView = () => {
  // Generate dummy days for a calendar view
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const startOffset = 3; // Starts on a Wednesday

  return (
    <div className="animate-fade-in calendar-container">
      <header className="page-header">
        <h1>Calendar</h1>
        <p className="subtitle">Schedule your tasks with Time Blocking.</p>
      </header>

      <div className="calendar-card glass-panel">
        <div className="calendar-header">
          <h2>September 2026</h2>
          <div className="calendar-nav">
            <button className="btn-icon"><ChevronLeft /></button>
            <button className="btn-icon"><ChevronRight /></button>
          </div>
        </div>

        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-cell empty"></div>
          ))}

          {daysInMonth.map(day => (
            <div key={day} className={`calendar-cell ${day === 5 ? 'has-event' : ''} ${day === 3 ? 'today' : ''}`}>
              <span className="day-number">{day}</span>
              {day === 5 && (
                <div className="event-badge high-priority">Design UI mockup</div>
              )}
              {day === 10 && (
                <div className="event-badge medium-priority">Frontend Logic</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
