// themeStore.js
import { create } from 'zustand';

// Создаем хранилище для темы
const useThemeStore = create((set) => ({
  isDarkMode: localStorage.getItem('theme') === 'dark', // Получаем тему из localStorage
  toggleTheme: () => {
    set((state) => {
      const newTheme = !state.isDarkMode;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light'); // Сохраняем тему в localStorage
      return { isDarkMode: newTheme };
    });
  },
}));

export default useThemeStore;