import React, { useState } from 'react';
import { showSuccessAlert } from './swalUtils'; // Импортируем функцию
import Swal from 'sweetalert2';
import './App.css';

function App() {
    // Состояния для формы
    const [activityType, setActivityType] = useState('work'); // Тип активности
    const [startTime, setStartTime] = useState(''); // Время начала
    const [endTime, setEndTime] = useState(''); // Время окончания
    const [totalTime, setTotalTime] = useState(''); // Общее время
    const [comment, setComment] = useState(''); // Комментарий
  
    // Обработчики изменений полей
    const handleActivityTypeChange = (e) => setActivityType(e.target.value);
    const handleStartTimeChange = (e) => setStartTime(e.target.value);
    const handleEndTimeChange = (e) => setEndTime(e.target.value);
    const handleCommentChange = (e) => setComment(e.target.value);
  
    // Установка текущего времени для начала активности
    const setCurrentStartTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setStartTime(`${hours}:${minutes}:${seconds}`);
    };
  
    // Установка текущего времени для окончания активности
    const setCurrentEndTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setEndTime(`${hours}:${minutes}:${seconds}`);
    };
  
    // Вычисление общего времени
    const calculateTotalTime = () => {
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  
      // Проверка формата времени
      if (!timePattern.test(startTime)) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка',
          text: 'Некорректный формат времени начала.',
        });
        return;
      }
      if (!timePattern.test(endTime)) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка',
          text: 'Некорректный формат времени окончания.',
          showClass: {
            popup: 'swal2-show', // Анимация появления
        },
        hideClass: {
            popup: 'swal2-hide', // Анимация исчезновения
        },
        timer: 1500, // Автоматическое закрытие через 1.5 секунды
        timerProgressBar: true, // Показывать прогрессбар таймера
        didOpen: () => {
            Swal.getPopup().style.transition = 'transform 0.1s ease-out'; // Ускорение анимации
        },
        });
        return;
      }
  
      // Преобразуем время в объекты Date
      const startDate = new Date(`1970-01-01T${startTime}Z`);
      const endDate = new Date(`1970-01-01T${endTime}Z`);
  
      // Вычисляем разницу в миллисекундах
      const diffInMs = endDate - startDate;
  
      // Если разница отрицательная, значит end-time меньше start-time
      if (diffInMs < 0) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка',
          text: 'Время окончания не может быть меньше времени начала',
          showClass: {
            popup: 'swal2-show', // Анимация появления
        },
        hideClass: {
            popup: 'swal2-hide', // Анимация исчезновения
        },
        timer: 1500, // Автоматическое закрытие через 1.5 секунды
        timerProgressBar: true, // Показывать прогрессбар таймера
        didOpen: () => {
            Swal.getPopup().style.transition = 'transform 0.1s ease-out'; // Ускорение анимации
        },
        });
        return;
      }
  
      // Преобразуем разницу в формат hh:mm:ss
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;
  
      // Форматируем результат
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(
        minutes
      ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
      // Устанавливаем общее время
      setTotalTime(formattedTime);
    };
  
// Обработчик добавления активности
const handleAddActivity = () => {
  // Вызов метода из Go
  window.go.main.App.PrintHelloWorld(activityType,startTime,endTime,totalTime,comment).then(() => {
    showSuccessAlert('Добавление новой активности', 'Активность успешно добавлена!');
  });
};
  
    return (
      <div id="App">
        <form>
          <div>
            <label id="top-label">Добавление активности:</label>
          </div>
  
          {/* Тип активности */}
          <div className="form-row">
            <label htmlFor="activity-type">Тип :</label>
            <select
              id="activity-type"
              className="select-field"
              value={activityType}
              onChange={handleActivityTypeChange}
            >
              <option value="work">Работа</option>
              <option value="rest">Отдых</option>
              <option value="sport">Спорт</option>
            </select>
            <button type="button" id="add-activity" onClick={handleAddActivity}>
              +
            </button>
          </div>
  
          {/* Время начала активности */}
          <div className="form-row">
            <label htmlFor="start-time">Начало :</label>
            <input
              type="text"
              id="start-time"
              placeholder="hh:mm:ss"
              value={startTime}
              onChange={handleStartTimeChange}
            />
            <button type="button" id="set-start-time" onClick={setCurrentStartTime}>
              *
            </button>
          </div>
  
          {/* Время окончания активности */}
          <div className="form-row">
            <label htmlFor="end-time">Конец :</label>
            <input
              type="text"
              id="end-time"
              placeholder="hh:mm:ss"
              value={endTime}
              onChange={handleEndTimeChange}
            />
            <button type="button" id="set-end-time" onClick={setCurrentEndTime}>
              *
            </button>
          </div>
  
          {/* Общее время */}
          <div className="form-row">
            <label htmlFor="total-time">Общее время :</label>
            <input
              type="text"
              id="total-time"
              placeholder="hh:mm:ss"
              value={totalTime}
              readOnly
            />
            <button type="button" id="set-total-time" onClick={calculateTotalTime}>
              *
            </button>
          </div>
  
          {/* Комментарии */}
          <div className="form-row">
            <label htmlFor="comment">Комментарий :</label>
            <textarea
              id="comment"
              name="comment-activity"
              rows="2"
              cols="40"
              placeholder="Comments"
              value={comment}
              onChange={handleCommentChange}
            />
          </div>
  
          {/* Кнопка добавления */}
          <div className="form-row">
            <button type="button" onClick={handleAddActivity}>
              Добавить запись
            </button>
          </div>
        </form>
      </div>
    );
  }
  
export default App;