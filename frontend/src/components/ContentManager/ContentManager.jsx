import React from 'react';
import AppFixAct from '../fixact/AppFixAct';
// Импортируйте другие компоненты, которые будут отображаться
import AnotherComponent from '../AnotherComponent/AnotherComponent'; // Импортируйте другие компоненты
import Stopwatch from '../Stopwatch/Stopwatch';
import SettApp from '../settApp/SettApp';


const components = {
  AppFixAct: <AppFixAct />,
  AnotherComponent: <AnotherComponent />,
  Stopwatch: <Stopwatch />,
  SettApp: <SettApp />
  // Добавьте другие компоненты
};


// ГЛАВНЫЙ ОТРИСОВЩИК АКТИВНОГО ПРИЛОЖЕНИЯ
const ContentManager = ({ activeComponent }) => {
  return components[activeComponent] || <AppFixAct />; // По умолчанию отображаем AppFixAct
};


export default ContentManager;