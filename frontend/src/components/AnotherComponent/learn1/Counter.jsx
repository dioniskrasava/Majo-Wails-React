import React from 'react';
import { useCounterStore } from './store';

// для реализации мультиязычности
import { FormattedMessage, useIntl } from 'react-intl';

const Counter = () => {
  // Получаем состояние и функции из хранилища
  const { count, increment, decrement, reset } = useCounterStore();

  //
  const intl = useIntl();
/*
  return (
    <div>
      <h1>Счетчик: {count}</h1>
      <button onClick={increment}>Увеличить</button>
      <button onClick={decrement}>Уменьшить</button>
      <button onClick={reset}>Сбросить</button>
    </div>
  );
};
*/

return (
  <div>
    <h1>
      <FormattedMessage
        id="counter.title"
        values={{ count }}
      />
    </h1>
    <button onClick={increment}>
      <FormattedMessage id="counter.increment" />
    </button>
    <button onClick={decrement}>
      <FormattedMessage id="counter.decrement" />
    </button>
    <button onClick={reset}>
      <FormattedMessage id="counter.reset" />
    </button>
  </div>
);
};

export default Counter;

