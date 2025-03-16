// src/components/fixact/activityform/ActivityForm.jsx
import React, { useState } from 'react';
import CategorySelect from './CategorySelect';
import TimeInput from './TimeInput';
import Stopwatch from '../../Stopwatch/Stopwatch';
import { useFormStore } from '../../utils/store';

import {calculateTotalTime } from "../utilsFixAct/timeUtils";



const ActivityForm = ({
  categories,
  handleAddTypeActivity,
  handleAddActivity
}) => {
  const [showStopwatch, setShowStopwatch] = useState(false);

 // Получаем состояние формы и функции из Zustand
 const { formData, updateFormData, setCurrentTime } = useFormStore();

  const toggleStopwatch = () => {
    setShowStopwatch((prev) => !prev);
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

  // ------------ДОПИСАТЬ---------------------
  //  на случай если юзер ручками поменяет общее время!!!
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


  

  return (
    <form id="form-fix-act">
      <div className="header-container">
        <label id="top-label">Добавление активности</label>
        <button type="button" onClick={toggleStopwatch} className="toggle-stopwatch-button">
          {showStopwatch ? "ᐃ" : "ᐁ"}
        </button>
      </div>

      {showStopwatch && <Stopwatch />}

      {/* Тип активности */}
      <CategorySelect
        categories={categories}
        activityType={formData.activityType}
        handleActivityTypeChange={handleActivityTypeChange}
        handleAddTypeActivity={handleAddTypeActivity}
      />

      {/* Время начала активности */}
      <TimeInput
        label="Начало :"
        id="start-time"
        value={formData.startTime}
        onChange={handleStartTimeChange}
        onSetCurrentTime={handleSetStartTime}
      />

      {/* Время окончания активности */}
      <TimeInput
        label="Конец :"
        id="end-time"
        value={formData.endTime}
        onChange={handleEndTimeChange}
        onSetCurrentTime={handleSetEndTime}
      />

      {/* Общее время */}
      <TimeInput
        label="Общее время :"
        id="total-time"
        value={formData.totalTime}
        readOnly
        onChange={handleTotalTimeChange}
        onSetCurrentTime={handleSetTotalTime}
      />

      {/* Комментарии */}
      <div className="form-row">
        <label htmlFor="comment" className="labelFormFixAct">
          Комментарий :
        </label>
        <textarea
          id="comment"
          name="comment-activity"
          rows="2"
          cols="40"
          placeholder="Comments"
          value={formData.comment}
          onChange={handleCommentChange}
        />
      </div>

      {/* Кнопка добавления */}
      <div className="form-row">
        <button type="button" onClick={handleAddActivity} className="buttonFixActAdd">
          Добавить запись
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;