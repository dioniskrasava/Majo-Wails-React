// Этот компонент будет отвечать за отображение формы добавления активности.

import React from "react";
import CategorySelect from "./CategorySelect";
import TimeInput from "./TimeInput";

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
  return (
    <form>
      <div>
        <label id="top-label">Добавление активности:</label>
      </div>

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
        <label htmlFor="comment" className="labelFormFixAct">Комментарий :</label>
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
        <button type="button" onClick={handleAddActivity}>
          Добавить запись
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;