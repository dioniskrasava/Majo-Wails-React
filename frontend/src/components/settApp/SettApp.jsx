import React from 'react';
import './styleSettApp.css';

const SettApp = ({ setLocale, locale }) => { // Принимаем setLocale и locale из пропсов
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
            style={{ background: locale === 'en' ? 'linear-gradient(135deg, #e8431a, #004ba0)' : 'linear-gradient(135deg, #1a73e8, #004ba0)' }} // Подсветка активного языка
          >
            English
          </button>
          <button
            className="buttonSettApp"
            onClick={() => setLocale('ru')}
            style={{ background: locale === 'ru' ? 'linear-gradient(135deg, #e8431a, #004ba0)' : 'linear-gradient(135deg, #1a73e8, #004ba0)' }} // Подсветка активного языка
          >
            Русский
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