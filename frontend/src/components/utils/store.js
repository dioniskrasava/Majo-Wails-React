// src/store/store.js
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
}));

  export { useStopwatchStore, useFormStore };