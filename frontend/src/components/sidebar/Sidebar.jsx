import React, { useState } from 'react';
import './Sidebar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbTack, faTable, faGear } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ onButtonClick }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-buttons">
      <button className="sidebar-button" onClick={() => onButtonClick('AppFixAct')}>
        <FontAwesomeIcon icon={faThumbTack} size='lg' className='iconsSideBar'/>
      </button>
      <button className="sidebar-button" onClick={() => onButtonClick('TableApp')}>
        <FontAwesomeIcon icon={faTable} />
      </button>
      <button className="sidebar-button" onClick={() => onButtonClick('AnotherComponent')}>
        β
      </button>
      <button className="sidebar-button" onClick={() => onButtonClick('EngWo')}>
        EW
      </button>
      <button className="sidebar-button" onClick={() => onButtonClick('Notes')}>
        NO
      </button>
      <button className="sidebar-button" onClick={() => onButtonClick('SettApp')}>
        <FontAwesomeIcon icon={faGear} size='lg' />
      </button>
      {/* Добавьте другие кнопки */}
      </div>
    </div>
  );
};

export default Sidebar;