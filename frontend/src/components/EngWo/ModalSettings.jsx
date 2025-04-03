import React from 'react';
import './modalStyles.css';

import { TooltipReferenceCustom } from '../auxiliaryComponents/TooltipCustom';

const downCSVTooltipText = "Переписывает значение базы данных из csv файла. <br> Стирает весь прогресс при отсутствии в csv файле данных о прогрессе"

const ModalSettings = ({ onClose }) => {


  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <h3 className="modal-title">МОДАЛЬНОЕ ОКНО НАСТРОЕК</h3>
        <p>Загрузка данных приложения :</p>
        <div>
          <button
            onClick={() => {
              window.go.main.App.WriteAndRead();
            }}
            data-tooltip-id="downCSV-tooltip"
            data-tooltip-content={downCSVTooltipText}
          >
            Загрузить из csv
          </button>
          <TooltipReferenceCustom id="downCSV-tooltip" styleColor="grayBlue"/>
        </div>

      </div>

    </>
  );
};

export default ModalSettings;
