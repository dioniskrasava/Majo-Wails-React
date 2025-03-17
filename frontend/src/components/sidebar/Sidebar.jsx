import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onButtonClick }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-buttons">
      <button className="sidebar-button" onClick={() => onButtonClick('AppFixAct')}>
        <i class="fa-solid fa-newspaper"></i>
        
      </button>
      <button className="sidebar-button" onClick={() => onButtonClick('AnotherComponent')}>
        β
      </button>
      <button className="sidebar-button" onClick={() => onButtonClick('SettApp')}>
        <i class="fa-solid fa-wrench"></i>
      </button>
      {/* Добавьте другие кнопки */}
      </div>
    </div>
  );
};

export default Sidebar;