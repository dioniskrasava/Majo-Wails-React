import React, { useState } from "react";
import { showSuccessAlert } from "./utils/swalUtils";
import Swal from "sweetalert2";
import "./App.css";
import ActivityForm from "./components/ActivityForm";
import useCategories from "./hooks/useCategories";
import { setCurrentTime, calculateTotalTime } from "./utils/timeUtils";

function App() {
  const { categories, activityType, setCategories, setActivityType } =
    useCategories();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [comment, setComment] = useState("");

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

  const handleAddTypeActivity = () => {
    Swal.fire({
      title: "Добавить новую категорию активности",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Введите название категории",
      },
      showCancelButton: true,
      confirmButtonText: "Добавить",
      showLoaderOnConfirm: true,
      preConfirm: (newCategory) => {
        if (!newCategory) {
          Swal.showValidationMessage("Название категории не может быть пустым!");
          return false;
        }
        return newCategory;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const newCategory = result.value;

        window.go.main.App.SaveCategory(newCategory)
          .then(() => {
            setCategories((prevCategories) => [...prevCategories, newCategory]);
            setActivityType(newCategory);

            Swal.fire({
              title: "Успешно!",
              text: `Категория "${newCategory}" добавлена.`,
              icon: "success",
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Ошибка",
              text: `Не удалось сохранить категорию: ${error}`,
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <div id="App">
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
        handleAddTypeActivity={handleAddTypeActivity}
      />
    </div>
  );
}

export default App;