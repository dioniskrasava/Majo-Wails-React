import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import Sidebar from './components/sidebar/Sidebar';
import ContentManager from './components/ContentManager/ContentManager'



const container = document.getElementById('root');
const root = createRoot(container);

const App = () => {
  const [activeComponent, setActiveComponent] = useState('AppFixAct');

  return (
    <React.StrictMode>
      <div id="globalApp">
        <Sidebar onButtonClick={setActiveComponent} />
        <div id="App">
          <ContentManager activeComponent={activeComponent} />
        </div>
      </div>
    </React.StrictMode>
  );
};

root.render(<App />);