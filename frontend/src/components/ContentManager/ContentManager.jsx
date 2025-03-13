import React from 'react';
import AppFixAct from '../fixact/AppFixAct';
// Импортируйте другие компоненты, которые будут отображаться
import AnotherComponent from '../AnotherComponent/AnotherComponent'; // Импортируйте другие компоненты


const components = {
  AppFixAct: <AppFixAct />,
  AnotherComponent: <AnotherComponent />,
  // Добавьте другие компоненты
};

const ContentManager = ({ activeComponent }) => {
  return components[activeComponent] || <AppFixAct />; // По умолчанию отображаем AppFixAct
};

// или такой код (но тогда нужно удалить components)
/*
const ContentManager = ({ activeComponent }) => {
  switch (activeComponent) {
    case 'AppFixAct':
      return <AppFixAct />;
    case 'AnotherComponent':
      return <AnotherComponent />; // Добавляем кейс для AnotherComponent
    default:
      return <AppFixAct />; // По умолчанию отображаем AppFixAct
  }
};
*/ 

export default ContentManager;