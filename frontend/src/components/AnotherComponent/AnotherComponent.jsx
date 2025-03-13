import React from 'react';
import './AnotherComponent.css'; // Подключаем стили

const AnotherComponent = () => {
  const handleClick = () => {
    alert('Привет! Это AnotherComponent!');
  };

  return (
    <div className="another-component">
      <h1>Another Component</h1>
      <button onClick={handleClick}>Нажми на меня</button>
    </div>
  );
};

export default AnotherComponent;