import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Music, Volume2 } from 'lucide-react';
import './Pomodoro.css';

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, break
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      // Logic for switching modes could go here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const toggleSound = () => setSoundEnabled(!soundEnabled);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((mode === 'focus' ? 25 * 60 : 5 * 60) - timeLeft) / (mode === 'focus' ? 25 * 60 : 5 * 60) * 100;

  return (
    <div className="animate-fade-in pomodoro-container">
      <header className="page-header">
        <h1>Pomodoro Focus</h1>
        <p className="subtitle">Stay in the zone and maximize productivity.</p>
      </header>

      <div className="pomodoro-card glass-panel">
        <div className="mode-selector">
          <button 
            className={`mode-btn ${mode === 'focus' ? 'active' : ''}`}
            onClick={() => switchMode('focus')}
          >
            Focus Session (25m)
          </button>
          <button 
            className={`mode-btn ${mode === 'break' ? 'active' : ''}`}
            onClick={() => switchMode('break')}
          >
            Short Break (5m)
          </button>
        </div>

        <div className="timer-display">
          <svg className="timer-circle" viewBox="0 0 100 100">
            <circle className="circle-bg" cx="50" cy="50" r="45"></circle>
            <circle 
              className="circle-progress" 
              cx="50" cy="50" r="45" 
              style={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
            ></circle>
          </svg>
          <div className="time-text">{formatTime(timeLeft)}</div>
        </div>

        <div className="timer-controls">
          <button className="control-btn" onClick={resetTimer}>
            <RotateCcw size={24} />
          </button>
          <button className="control-btn primary" onClick={toggleTimer}>
            {isActive ? <Pause size={32} /> : <Play size={32} style={{marginLeft: '4px'}} />}
          </button>
          <button className={`control-btn ${soundEnabled ? 'active' : ''}`} onClick={toggleSound}>
            {soundEnabled ? <Volume2 size={24} /> : <Music size={24} />}
          </button>
        </div>
        
        {soundEnabled && (
          <div className="focus-sounds">
            <p>🎵 Playing Rain & Cafe Ambience (Simulated)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pomodoro;
