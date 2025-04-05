import React from "react";
import "./style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faM,
  faA,
  faJ,
  faO,
  faV,
  fa0,
  fa1,
  fa2,
  faHandPointDown,
} from "@fortawesome/free-solid-svg-icons";

const WelcomeWindow = () => {
  const sizeVersion = "1x";
  return (
    <div className="welcome-container">
      {" "}
      {/* Новый контейнер */}
      <div className="title-container">
        {" "}
        {/* Контейнер для букв */}
        <span className="welcomeNameLabel underlined">
          <FontAwesomeIcon icon={faM} size="4x" />
        </span>
        <span className="welcomeNameLabel">
          <FontAwesomeIcon icon={faA} size="3x" />
        </span>
        <span className="welcomeNameLabel underlined">
          <FontAwesomeIcon icon={faJ} size="4x" />
        </span>
        <span className="welcomeNameLabel">
          <FontAwesomeIcon icon={faO} size="3x" />
        </span>
      </div>
      <div className="version-container">
        <span className="version-text">version 0.0.12</span>
      </div>
      <h1>Добро пожаловать</h1>
      <p>Вы запустили Main Journal. Сокращенно - MaJo.</p>
    </div>
  );
};

export default WelcomeWindow;
