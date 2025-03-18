// src/components/fixact/activityform/ActivityForm.jsx
import React, { useState } from 'react';
import CategorySelect from './CategorySelect';
import TimeInput from './TimeInput';
import Stopwatch from '../../Stopwatch/Stopwatch';
import { useFormStore } from '../../utils/store';

import {calculateTotalTime } from "../utilsFixAct/timeUtils";

import {useStopwatchStore} from '../../utils/store'

import { FormattedMessage } from 'react-intl'; // multilanguage
import { useIntl } from 'react-intl';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

import Swal from "sweetalert2";



const ActivityForm = ({
  categories,
  handleAddTypeActivity,
  handleAddActivity
}) => {

  const {isOpen, toggleIsOpen} = useStopwatchStore();

 // Получаем состояние формы и функции из Zustand
 const { formData, updateFormData, setCurrentTime } = useFormStore();


 // обертка для переключения глоб.состояния видимости таймера
  const toggleStopwatch = () => {
    toggleIsOpen(); // Используем функцию из хранилища
  };

  // Обработчики изменений полей формы
  // я так понимаю, что эти обработчики анализируют, что вписал пользователь в это поле ручками
  const handleActivityTypeChange = (e) => {
    updateFormData('activityType', e.target.value);
  };

  const handleStartTimeChange = (e) => {
    updateFormData('startTime', e.target.value);
  };

  const handleEndTimeChange = (e) => {
    updateFormData('endTime', e.target.value);
  };

  const handleCommentChange = (e) => {
    updateFormData('comment', e.target.value);
  };

  const handleTotalTimeChange = () => {
    updateFormData('totalTime', e.target.value);
  }

  // Функция для установки текущего времени начала
  const handleSetStartTime = () => {
    setCurrentTime('startTime');
  };

  // Функция для установки текущего времени окончания
  const handleSetEndTime = () => {
    setCurrentTime('endTime');
  };

  // обертка для вызова функции подсчета времени активности
  const handleSetTotalTime = () => {
    let totalTime = calculateTotalTime(formData.startTime, formData.endTime);
    updateFormData("totalTime", totalTime)
  }

  const intl = useIntl(); // хук для вставки мультиязычного значения в placeholder комментария

  const placeholderText = intl.formatMessage({
    id: 'fixact.commentPlaceHolder',
    defaultMessage: 'Ваши комментарии',
  });

  const ShowReferenceInfo = () => {
    Swal.fire("SweetAlert2 is working!");
  }
  

  return (
    
  <>
  <button id='referenceButton' onClick={ShowReferenceInfo}>?</button>
    <form id="form-fix-act">
      <div className="header-container">
        <label id="top-label"><FormattedMessage id="fixact.title" defaultMessage="Добавление активности" /></label>
        <button type="button" onClick={toggleStopwatch} className="toggle-stopwatch-button">
          <FontAwesomeIcon icon={faClock} size='lg' /> 
        </button>
      </div>

      {/*Если состояние таймера тру, то рисуем его*/}
      {(isOpen && <Stopwatch />)}

      {/* Тип активности */}
      <CategorySelect
        categories={categories}
        activityType={formData.activityType}
        handleActivityTypeChange={handleActivityTypeChange}
        handleAddTypeActivity={handleAddTypeActivity}
      />

      {/* Время начала активности */}
      <TimeInput
        label={<FormattedMessage id="fixact.beginTime" defaultMessage="Начало" />}
        id="start-time"
        value={formData.startTime}
        onChange={handleStartTimeChange}
        onSetCurrentTime={handleSetStartTime}
      />

      {/* Время окончания активности */}
      <TimeInput
        label={<FormattedMessage id="fixact.endTime" defaultMessage="Конец" />}
        id="end-time"
        value={formData.endTime}
        onChange={handleEndTimeChange}
        onSetCurrentTime={handleSetEndTime}
      />

      {/* Общее время */}
      <TimeInput
        label={<FormattedMessage id="fixact.totalTime" defaultMessage="Общее время" />}
        id="total-time"
        value={formData.totalTime}
        readOnly
        onChange={handleTotalTimeChange}
        onSetCurrentTime={handleSetTotalTime}
      />

      {/* Комментарии */}
      <div className="form-row">
        <label htmlFor="comment" className="labelFormFixAct">
          <FormattedMessage id="fixact.commentAct" defaultMessage="Комментарий" />
        </label>
        <textarea
          id="comment"
          name="comment-activity"
          rows="2"
          cols="40"
          placeholder={placeholderText}
          value={formData.comment}
          onChange={handleCommentChange}
        />
      </div>

      {/* Кнопка добавления */}
      <div className="form-row">
        <button type="button" onClick={handleAddActivity} className="buttonFixActAdd">
          <FormattedMessage id="fixact.addAct" defaultMessage="Добавить запись" />
        </button>
      </div>
    </form>
  </>
  );
};

export default ActivityForm;