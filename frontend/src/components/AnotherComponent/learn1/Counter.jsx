import React from 'react';
import { useCounterStore } from './store';

const Counter = () => {
  // Получаем состояние и функции из хранилища
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div>
      <h1>Счетчик: {count}</h1>
      <button onClick={increment}>Увеличить</button>
      <button onClick={decrement}>Уменьшить</button>
      <button onClick={reset}>Сбросить</button>
    </div>
  );
};

export default Counter;

