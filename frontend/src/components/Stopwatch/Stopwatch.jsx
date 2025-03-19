// src/components/Stopwatch/Stopwatch.jsx
import React, { useEffect } from 'react';
import './Stopwatch.css';
import { useStopwatchStore } from '../utils/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useFormStore } from '../utils/store';

const Stopwatch = () => {
  const {
    time,
    isRunning,
    start,
    stop,
    reset,
    incrementTime,
    history,
    addEvent,
    clearHistory, // Добавляем функцию очистки логов
  } = useStopwatchStore();
  const { setCurrentTime } = useFormStore();

  // Эффект для обновления времени
  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        incrementTime();
      }, 50); // Обновление каждые 50 миллисекунд
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

  // Обработчик старта
  const handleStart = () => {
    start();
    addEvent({ type: 'start', time: formatTime(time) }); // Добавляем событие "старт"
    setCurrentTime('startTime');
  };

  // Обработчик паузы
  const handleStop = () => {
    stop();
    // Находим последнее событие "старт"
    const lastStartEvent = history.findLast((event) => event.type === 'start');
    if (lastStartEvent) {
      const startTime = lastStartEvent.time;
      const pauseTime = formatTime(time);
      const duration = formatTime(time - lastStartEvent.time); // Вычисляем разницу
      addEvent({ type: 'pause', startTime, pauseTime, duration }); // Добавляем событие "пауза" с разницей
    }
  };

  // Обработчик сброса (только времени, не логов)
  const handleReset = () => {
    reset();
  };

  // Обработчик очистки логов
  const handleClearHistory = () => {
    clearHistory();
  };

  // Функция для отображения истории событий
  const renderHistory = () => {
    return history.map((event, index) => {
      if (event.type === 'start') {
        return null; // События "старт" не отображаем отдельно
      } else if (event.type === 'pause') {
        return (
          <div key={index}>
            Старт: {event.startTime} --- Пауза: {event.pauseTime} ({event.duration})
          </div>
        );
      } else if (event.type === 'reset') {
        return <div key={index}>Сброс: {event.time}</div>;
      }
      return null;
    });
  };

  return (
    <div className="stopwatch">
      <div className="time-and-buttons">
        <div className="time">{formatTime(time)}</div>
        <div className="buttons">
          <button type="button" onClick={handleStart} disabled={isRunning}>
            <FontAwesomeIcon icon={faPlay} /> {/* Иконка "play" */}
          </button>
          <button type="button" onClick={handleStop} disabled={!isRunning}>
            <FontAwesomeIcon icon={faPause} /> {/* Иконка "pause" */}
          </button>
          <button type="button" onClick={handleReset}>
            <FontAwesomeIcon icon={faStop} /> {/* Иконка "stop" */}
          </button>
          {/* Кнопка очистки логов (появляется только при наличии логов) */}
          {history.length > 0 && (
            <button type="button" onClick={handleClearHistory}>
              <FontAwesomeIcon icon={faTrash} /> {/* Иконка "trash" */}
            </button>
          )}
        </div>
      </div>
      <div className="history">
        {renderHistory()} {/* Отображаем историю событий */}
      </div>
    </div>
  );
};

export default Stopwatch;