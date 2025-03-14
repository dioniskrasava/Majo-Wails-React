import { create } from 'zustand';

const useCounterStore = create((set) => ({
  count: 0, 
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }), 
}));

export { useCounterStore };



/*Всё до усрачки просто. useCounetStore это ф-я, которая возвращает
объект состоящий из 4 объектов.
1 - переменная состояния счетчика
2 - ф-я увеличения состояния счетчика
3 - ф-я уменьшения состояние счетчика
3 - ф-я обнуления состояния счетчика
*/