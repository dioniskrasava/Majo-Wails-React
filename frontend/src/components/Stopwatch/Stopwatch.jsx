// src/components/Stopwatch/Stopwatch.jsx
import React, { useEffect } from 'react';
import './Stopwatch.css';
import { useStopwatchStore } from '../utils/store';

const Stopwatch = () => {
  const { time, isRunning, start, stop, reset, incrementTime } = useStopwatchStore();

  // Эффект для обновления времени
  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        incrementTime();
      }, 50);
    }

    return () => clearInterval(interval);
  }, [isRunning, incrementTime]);

  // Форматирование времени
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
  };

  return (
    <div className="stopwatch">
      <div className="time-and-buttons">
        <div className="time">{formatTime(time)}</div>
        <div className="buttons">
          <button type="button" onClick={start} disabled={isRunning}>
            ▶
          </button>
          <button type="button" onClick={stop} disabled={!isRunning}>
            ⏸
          </button>
          <button type="button" onClick={reset}>⏹</button>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;