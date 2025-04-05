// frontend/src/main.jsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import Sidebar from './components/sidebar/Sidebar';
import ContentManager from './components/ContentManager/ContentManager';

import WelcomeWindow from './components/welcome/WelcomeWindow'

import { IntlProvider } from 'react-intl';
import enMessages from './locales/en.json'; // REALIZATION MULTI-LINGUALISM
import ruMessages from './locales/ru.json'; // REALIZATION MULTI-LINGUALISM

const messages = {
  en: enMessages,
  ru: ruMessages,
};

const container = document.getElementById('root');
const root = createRoot(container);

const App = () => {
  const [activeComponent, setActiveComponent] = useState('WelcomeWindow');
  const [locale, setLocale] = useState('ru'); // По умолчанию язык - русский

  return (
    <React.StrictMode>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div id="globalApp">
          <Sidebar onButtonClick={setActiveComponent} />
          <div id="App">
            <ContentManager
              activeComponent={activeComponent}
              setLocale={setLocale}
              locale={locale} // Передаем текущий язык
              setActiveComponent={setActiveComponent}
            />
          </div>
        </div>
      </IntlProvider>
    </React.StrictMode>
  );
};

root.render(<App />);