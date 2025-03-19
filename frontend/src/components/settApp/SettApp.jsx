import React, { useEffect } from 'react';
import './styleSettApp.css';
import useThemeStore from '../utils/themeStore'; // Импортируем хранилище Zustand

const SettApp = ({ setLocale, locale }) => {
  // Получаем состояние и методы из хранилища
  const { isDarkMode, toggleTheme } = useThemeStore();

  // Применяем тему при загрузке компонента
  useEffect(() => {
    const rootElement = document.documentElement;
    if (isDarkMode) {
      rootElement.style.backgroundColor = '#2d2e30';
      rootElement.style.color = 'white';
    } else {
      rootElement.style.backgroundColor = 'white';
      rootElement.style.color = 'black';
    }
  }, [isDarkMode]);

  return (
    <div>
      <div>
        HELLO SETTAPP (SETTINGS APPLICATION)
        <div>
          <button className="buttonSettApp" onClick={AddWidth}>W+</button>
          <button className="buttonSettApp" onClick={IncWidth}>H+</button>
        </div>
        <div>
          <button
            className="buttonSettApp"
            onClick={() => setLocale('en')}
            style={{ background: locale === 'en' ? 'linear-gradient(135deg, #e8431a, #004ba0)' : 'linear-gradient(135deg, #1a73e8, #004ba0)' }}
          >
            English
          </button>
          <button
            className="buttonSettApp"
            onClick={() => setLocale('ru')}
            style={{ background: locale === 'ru' ? 'linear-gradient(135deg, #e8431a, #004ba0)' : 'linear-gradient(135deg, #1a73e8, #004ba0)' }}
          >
            Русский
          </button>
        </div>
        <div>
          <button className="buttonSettApp" onClick={toggleTheme}>
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddWidth = () => {
  window.go.main.App.SetSettings("WIDTH", 800);
  let w, h = window.go.main.App.GetWindowSize();
  console.log('Window size:', w, h);
};

const IncWidth = () => {
  window.go.main.App.SetSettings("HEIGHT", 800);
};

export default SettApp;