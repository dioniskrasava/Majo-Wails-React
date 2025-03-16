import { create } from 'zustand';

// Создаем хранилище для состояния таймера
const useStopwatchStore = create((set) => ({
  time: 0, // Текущее время
  isRunning: false, // Состояние работы таймера

  // Запуск таймера
  start: () => set({ isRunning: true }),

  // Остановка таймера
  stop: () => set({ isRunning: false }),

  // Сброс таймера
  reset: () => set({ time: 0, isRunning: false }),

  // Увеличение времени
  incrementTime: () => set((state) => ({ time: state.time + 50 })),

  // открыт ли секундомер
  isOpen: false,

   // Переключение состояния isOpen
   toggleIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),

}));


// Хранилище для формы
const useFormStore = create((set) => ({
  formData: {
    activityType: '', // Тип активности
    startTime: '',    // Время начала
    endTime: '',      // Время окончания
    totalTime: '',    // Общее время
    comment: '',      // Комментарий
  },

  // Функция для обновления данных формы
  updateFormData: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),

  // Функция для установки текущего времени
  setCurrentTime: (field) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;

    set((state) => ({
      formData: {
        ...state.formData,
        [field]: currentTime,
      },
    }));
  },
}));


export { useStopwatchStore, useFormStore };