import React, { useState } from "react";
import { showSuccessAlert } from "./utilsFixAct/swalUtils";
import Swal from "sweetalert2";
import "./AppFixAct.css";

import ActivityForm from "./activityform/ActivityForm";
import useCategories from "./hooks/useCategories";
import handleAddTypeActivity from "./utilsFixAct/handleAddTypeActivity"; // Импортируем функцию

import { useFormStore } from "../utils/store";




function AppFixAct() {
  const { categories, activityType, setCategories, setActivityType } = useCategories(); 

  const { formData, updateFormData, setCurrentTime } = useFormStore();
  
  // добавление активности в БД (---> go)
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


 

  // Я пока ТУТ чудить не буду
  // но нужно удалить все параметры
  // потому что главный контент-менеджер дергает этот компонент без атрибутов и всё работает, потому что находится в глоб.состояниях zustand
  return (
      <ActivityForm
        categories={categories}
        handleAddActivity={handleAddActivity}
        handleAddTypeActivity={() => handleAddTypeActivity(setCategories, setActivityType)} // Используем функцию
      />
  );
}

export default AppFixAct;