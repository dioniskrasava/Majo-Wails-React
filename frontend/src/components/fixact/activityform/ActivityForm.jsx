// Этот компонент будет отвечать за отображение формы добавления активности.

import React from "react";
import CategorySelect from "./CategorySelect";
import TimeInput from "./TimeInput";

import { useState } from "react";
import Stopwatch from "../../Stopwatch/Stopwatch";






const ActivityForm = ({
  categories,
  activityType,
  startTime,
  endTime,
  totalTime,
  comment,
  handleActivityTypeChange,
  handleStartTimeChange,
  handleEndTimeChange,
  handleCommentChange,
  setCurrentStartTime,
  setCurrentEndTime,
  calculateTotalTime,
  handleAddActivity,
  handleAddTypeActivity,
}) => {

  const [showStopwatch, setShowStopwatch] = useState(false); // Состояние для управления видимостью таймера


  // Функция для переключения видимости таймера
const toggleStopwatch = () => {
  setShowStopwatch((prev) => !prev);
};

  return (
  <form id="form-fix-act">
    <div className="header-container">
      <label id="top-label">Добавление активности</label>
      {/* Кнопка для показа/скрытия таймера */}
      <button type="button" onClick={toggleStopwatch} className="toggle-stopwatch-button">
        {showStopwatch ? "ᐃ" : "ᐁ"}
      </button>
    </div>

    {/* Условный рендеринг таймера */}
    {showStopwatch && <Stopwatch />}

    {/* Тип активности */}
    <CategorySelect
      categories={categories}
      activityType={activityType}
      handleActivityTypeChange={handleActivityTypeChange}
      handleAddTypeActivity={handleAddTypeActivity}
    />

    {/* Время начала активности */}
    <TimeInput
      label="Начало :"
      id="start-time"
      value={startTime}
      onChange={handleStartTimeChange}
      onSetCurrentTime={setCurrentStartTime}
    />

    {/* Время окончания активности */}
    <TimeInput
      label="Конец :"
      id="end-time"
      value={endTime}
      onChange={handleEndTimeChange}
      onSetCurrentTime={setCurrentEndTime}
    />

    {/* Общее время */}
    <TimeInput
      label="Общее время :"
      id="total-time"
      value={totalTime}
      readOnly
      onSetCurrentTime={calculateTotalTime}
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
        value={comment}
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