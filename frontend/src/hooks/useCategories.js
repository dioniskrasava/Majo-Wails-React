// Кастомный хук для работы с категориями.

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [activityType, setActivityType] = useState("");

  // Загрузка категорий при запуске
  useEffect(() => {
    window.go.main.App.LoadCategories()
      .then((loadedCategories) => {
        if (loadedCategories) {
          setCategories(loadedCategories);
          if (loadedCategories.length > 0) {
            setActivityType(loadedCategories[0]);
          }
        } else {
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке категорий:", error);
        Swal.fire({
          title: "Ошибка",
          text: "Не удалось загрузить категории.",
          icon: "error",
        });
      });
  }, []);

  return { categories, activityType, setCategories, setActivityType };
};

export default useCategories;