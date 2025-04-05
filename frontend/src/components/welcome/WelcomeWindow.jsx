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
          <FontAwesomeIcon icon={faM} size="9x" />
        </span>
        <span className="welcomeNameLabel">
          <FontAwesomeIcon icon={faA} size="7x" />
        </span>
        <span className="welcomeNameLabel underlined">
          <FontAwesomeIcon icon={faJ} size="9x" />
        </span>
        <span className="welcomeNameLabel">
          <FontAwesomeIcon icon={faO} size="7x" />
        </span>
      </div>
      <div className="version-container">
        <span className="version-text">version 0.0.12</span>
      </div>
    </div>
  );
};

export default WelcomeWindow;
