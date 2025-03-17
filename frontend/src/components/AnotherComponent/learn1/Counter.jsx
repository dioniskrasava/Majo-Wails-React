import React from 'react';
import { useCounterStore } from './store';

// для реализации мультиязычности
import { FormattedMessage, useIntl } from 'react-intl';

import './Counter.css'

const Counter = () => {
  // Получаем состояние и функции из хранилища
  const { count, increment, decrement, reset } = useCounterStore();

  //
  const intl = useIntl();


return (
  <div>
    <h1 className='counterLabel'>
      <FormattedMessage id="counter.title" values={{ count }}/>
    </h1>
    <button className='counterButton' onClick={increment}>
      <FormattedMessage id="counter.increment" />
    </button>
    <button className='counterButton' onClick={decrement}>
      <FormattedMessage id="counter.decrement" />
    </button>
    <button className='counterButton' onClick={reset}>
      <FormattedMessage id="counter.reset" />
    </button>
  </div>
);
};

export default Counter;

