import React, { useState } from "react";
import { showSuccessAlert } from "./utils/swalUtils";
import Swal from "sweetalert2";
import "./AppFixAct.css";

import ActivityForm from "./activityform/ActivityForm";
import useCategories from "./hooks/useCategories";
import { setCurrentTime, calculateTotalTime } from "./utils/timeUtils";
import handleAddTypeActivity from "./utils/handleAddTypeActivity"; // Импортируем функцию

import Stopwatch from "../Stopwatch/Stopwatch";

function AppFixAct() {
  const { categories, activityType, setCategories, setActivityType } =
    useCategories();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [comment, setComment] = useState("");
  const [showStopwatch, setShowStopwatch] = useState(false); // Состояние для управления видимостью таймера

  const handleActivityTypeChange = (e) => setActivityType(e.target.value);
  const handleStartTimeChange = (e) => setStartTime(e.target.value);
  const handleEndTimeChange = (e) => setEndTime(e.target.value);
  const handleCommentChange = (e) => setComment(e.target.value);

  const handleAddActivity = () => {
    window.go.main.App.AddActivityWithDB(
      activityType,
      startTime,
      endTime,
      totalTime,
      comment
    ).then(() => {
      showSuccessAlert(
        "Добавление новой активности",
        "Активность успешно добавлена!"
      );
    });
  };

  // Функция для переключения видимости таймера
  const toggleStopwatch = () => {
    setShowStopwatch((prev) => !prev);
  };

  return (
    <>
      {/* Кнопка для показа/скрытия таймера */}
      <button onClick={toggleStopwatch} className="toggle-stopwatch-button">
        {showStopwatch ? "Скрыть таймер" : "Показать таймер"}
      </button>

      {/* Условный рендеринг таймера */}
      {showStopwatch && <Stopwatch />}

      <ActivityForm
        categories={categories}
        activityType={activityType}
        startTime={startTime}
        endTime={endTime}
        totalTime={totalTime}
        comment={comment}
        handleActivityTypeChange={handleActivityTypeChange}
        handleStartTimeChange={handleStartTimeChange}
        handleEndTimeChange={handleEndTimeChange}
        handleCommentChange={handleCommentChange}
        setCurrentStartTime={() => setStartTime(setCurrentTime())}
        setCurrentEndTime={() => setEndTime(setCurrentTime())}
        calculateTotalTime={() => {
          try {
            setTotalTime(calculateTotalTime(startTime, endTime));
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Ошибка",
              text: error.message,
            });
          }
        }}
        handleAddActivity={handleAddActivity}
        handleAddTypeActivity={() => handleAddTypeActivity(setCategories, setActivityType)} // Используем функцию
      />
    </>
  );
}

export default AppFixAct;