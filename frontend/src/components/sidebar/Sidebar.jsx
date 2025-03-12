import React from 'react';
import './Sidebar.css'; // Подключаем стили для сайдбара

const Sidebar = () => {
  return (
    <div className="sidebar">
      <button className="sidebar-button">α</button>
      <button className="sidebar-button">β</button>
      <button className="sidebar-button">γ</button>
      <button className="sidebar-button">δ</button>
      <button className="sidebar-button">ε</button>
      <button className="sidebar-button">ζ</button>
      {/* Добавьте столько кнопок, сколько вам нужно */}
    </div>
  );
};

export default Sidebar;