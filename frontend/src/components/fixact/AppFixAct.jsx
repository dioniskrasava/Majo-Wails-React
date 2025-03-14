import React, { useState } from "react";
import { showSuccessAlert } from "./utilsFixAct/swalUtils";
import Swal from "sweetalert2";
import "./AppFixAct.css";

import ActivityForm from "./activityform/ActivityForm";
import useCategories from "./hooks/useCategories";
import { setCurrentTime, calculateTotalTime } from "./utilsFixAct/timeUtils";
import handleAddTypeActivity from "./utilsFixAct/handleAddTypeActivity"; // Импортируем функцию

import { useFormStore } from "../utils/store";


function AppFixAct() {
  const { categories, activityType, setCategories, setActivityType } =
    useCategories(); 
    /*
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [comment, setComment] = useState("");*/

 /* const handleActivityTypeChange = (e) => setActivityType(e.target.value);
  const handleStartTimeChange = (e) => setStartTime(e.target.value);
  const handleEndTimeChange = (e) => setEndTime(e.target.value);
  const handleCommentChange = (e) => setComment(e.target.value);*/

  const { formData, updateFormData, setCurrentTime } = useFormStore();
  
  // добавление активности в БД
  const handleAddActivity = () => {
    window.go.main.App.AddActivityWithDB(
      formData.activityType,
      formData.startTime,
      formData.endTime,
      formData.totalTime,
      formData.comment
    ).then(() => {
      showSuccessAlert(
        "Добавление новой активности",
        "Активность успешно добавлена!"
      );
    });
  };
 

  return (
      <ActivityForm
        categories={categories}
        handleAddActivity={handleAddActivity}
        handleAddTypeActivity={() => handleAddTypeActivity(setCategories, setActivityType)} // Используем функцию
        calculateTotalTime={calculateTotalTime}
      />
  );
}

export default AppFixAct;