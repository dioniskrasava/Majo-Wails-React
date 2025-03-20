// src/components/fixact/activityform/TimeInput.jsx
import React from 'react';

/*Импорты иконок*/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// кастомная всплывающая подсказка для кнопок
import TooltipCustom from '../../auxiliaryComponents/TooltipCustom'

const TimeInput = ({
  label,
  id,
  value,
  onChange,
  readOnly,
  onSetCurrentTime,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={id} className="labelFormFixAct">{label}</label>
      <input
        type="text"
        id={id}
        placeholder="hh:mm:ss"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
      <button 
        type="button" 
        id={`set-${id}`} 
        onClick={onSetCurrentTime} 
        className="button-fixact-support"
        data-tooltip-id="time-support-tooltip"
        data-tooltip-content="Вставить время">
        <FontAwesomeIcon icon={faArrowLeft} size='lg' />
      </button>
      <TooltipCustom id="time-support-tooltip" styleColor="grayBlue"/>
    </div>
  );
};

export default TimeInput;