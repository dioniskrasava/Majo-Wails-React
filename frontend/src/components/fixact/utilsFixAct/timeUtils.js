//  Утилиты для работы со временем.

import Swal from "sweetalert2";


// видимо можно ЭТО удалить, так-как есть клон этой функции в utils/store
export const setCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  
  export const calculateTotalTime = (startTime, endTime) => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  
    // Проверка формата времени начала
    if (!timePattern.test(startTime)) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка!',
        text: 'Некорректный формат времени начала.',
      });
      return null; // Возвращаем null, чтобы остановить выполнение
    }
  
    // Проверка формата времени окончания
    if (!timePattern.test(endTime)) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка!',
        text: 'Некорректный формат времени окончания.',
      });
      return null; // Возвращаем null, чтобы остановить выполнение
    }
  
    const startDate = new Date(`1970-01-01T${startTime}Z`);
    const endDate = new Date(`1970-01-01T${endTime}Z`);
    const diffInMs = endDate - startDate;
  
    // Проверка, что время окончания не меньше времени начала
    if (diffInMs < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка!',
        text: 'Время окончания не может быть меньше времени начала.',
      });
      return null; // Возвращаем null, чтобы остановить выполнение
    }
  
    // Вычисление разницы во времени
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;
  
    // Возвращаем результат в формате HH:MM:SS
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };