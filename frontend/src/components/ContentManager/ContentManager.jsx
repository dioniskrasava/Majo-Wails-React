import React from 'react';
import AppFixAct from '../fixact/AppFixAct';
import AnotherComponent from '../AnotherComponent/AnotherComponent';
import SettApp from '../settApp/SettApp';
import TableApp from '../TableApp/TableApp'
import EngWo from '../EngWo/EngWo'
import Notes from '../Notes/Notes'
import WelcomeWindow from '../welcome/WelcomeWindow'

// ГЛАВНЫЙ ОТРИСОВЩИК АКТИВНОГО ПРИЛОЖЕНИЯ
const ContentManager = ({ activeComponent, setLocale, locale }) => {
  const components = {
    WelcomeWindow: <WelcomeWindow/>,
    AppFixAct: <AppFixAct />,
    AnotherComponent: <AnotherComponent />,
    SettApp: <SettApp />, // Пока не передаем пропсы здесь
    TableApp: <TableApp/>,
    EngWo: <EngWo/>,
    Notes: <Notes/>
  };

  // Получаем компонент для активного приложения
  const Component = components[activeComponent] || <AppFixAct />;

  // Если активный компонент - SettApp, передаем setLocale и locale
  if (activeComponent === 'SettApp') {
    return React.cloneElement(Component, { setLocale, locale });
  }

  return Component;
};

export default ContentManager;