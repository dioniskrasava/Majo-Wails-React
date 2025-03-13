import React from 'react';
import AppFixAct from '../fixact/AppFixAct';
// Импортируйте другие компоненты, которые будут отображаться
import AnotherComponent from '../AnotherComponent/AnotherComponent'; // Импортируйте другие компоненты
import Stopwatch from '../Stopwatch/Stopwatch';


const components = {
  AppFixAct: <AppFixAct />,
  AnotherComponent: <AnotherComponent />,
  Stopwatch: <Stopwatch/>
  // Добавьте другие компоненты
};

const ContentManager = ({ activeComponent }) => {
  return components[activeComponent] || <AppFixAct />; // По умолчанию отображаем AppFixAct
};


export default ContentManager;