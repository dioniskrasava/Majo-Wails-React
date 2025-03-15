import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onButtonClick }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-buttons">
      <button className="sidebar-button" onClick={() => onButtonClick('AppFixAct')}>
        α
      </button>
      <button className="sidebar-button" onClick={() => onButtonClick('AnotherComponent')}>
        β
      </button>
      <button className="sidebar-button" onClick={() => onButtonClick('Stopwatch')}>
        t
      </button>
      <button className="sidebar-button" onClick={() => onButtonClick('SettApp')}>
        ...
      </button>
      {/* Добавьте другие кнопки */}
      </div>
    </div>
  );
};

export default Sidebar;