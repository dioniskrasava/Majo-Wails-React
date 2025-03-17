import React from 'react';
import './AnotherComponent.css'; // Подключаем стили
import  Counter  from './learn1/Counter'

import { FormattedMessage } from 'react-intl'; // multilanguage

const AnotherComponent = () => {
  const handleClick = () => {
    alert('Привет! Это AnotherComponent!');
  };

  return (
  <>
    <div className="another-component">
      <h1><FormattedMessage id="anotherComponent.title" defaultMessage="Another Component" /></h1>
      <button onClick={handleClick}>Нажми на меня</button>
    </div>
    <div>
      <Counter/>
    </div>
  </>
  );
};

export default AnotherComponent;