import React from 'react';
import { useCounterStore } from './store';

// для реализации мультиязычности
import { FormattedMessage, useIntl } from 'react-intl';

import './Counter.css'

import { Tooltip } from 'react-tooltip'; // всплывающие подсказки

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

    <button
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Это всплывающая подсказка"
      >
        Наведи на меня
      </button>
      <Tooltip
        id="my-tooltip"
        delayShow={500}
        delayHide={300}
        style={{
          background: 'linear-gradient(135deg,rgb(63, 137, 235),rgb(1, 47, 100))',
          color: '#fff',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '14px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      />

  </div>
);
};

export default Counter;

