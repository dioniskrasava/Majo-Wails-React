import React, { useState, useEffect } from 'react';
import './Stopwatch.css'; // Подключаем стили (опционально)

const Stopwatch = () => {
  const [time, setTime] = useState(0); // Состояние для хранения времени в миллисекундах
  const [isRunning, setIsRunning] = useState(false); // Состояние для отслеживания работы секундомера

  // Эффект для обновления времени каждые 50 миллисекунд
  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 50); // Увеличиваем время на 50 миллисекунд
      }, 50);
    }

    // Очистка интервала при размонтировании или остановке
    return () => clearInterval(interval);
  }, [isRunning]);

  // Функция для старта секундомера
  const handleStart = () => {
    setIsRunning(true);
  };

  // Функция для остановки секундомера
  const handleStop = () => {
    setIsRunning(false);
  };

  // Функция для сброса секундомера
  const handleReset = () => {
    setTime(0); // Обнуляем время
    if (isRunning) {
      // Если таймер работает, продолжаем его работу
      setIsRunning(true);
    }
  };

  // Форматирование времени в формат MM:SS:ms
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000); // 1 минута = 60000 миллисекунд
    const seconds = Math.floor((time % 60000) / 1000); // 1 секунда = 1000 миллисекунд
    const milliseconds = Math.floor((time % 1000) / 10); // Отображаем только две цифры миллисекунд
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
  };

  return (
    <div className="stopwatch">
  <div className="time-and-buttons">
    <div className="time">{formatTime(time)}</div>
    <div className="buttons">
      <button  type="button" onClick={handleStart} disabled={isRunning}>
        ▶
      </button>
      <button  type="button" onClick={handleStop} disabled={!isRunning}>
        ⏸
      </button>
      <button  type="button" onClick={handleReset}>⏹</button>
    </div>
  </div>
</div>
  );
};

export default Stopwatch;