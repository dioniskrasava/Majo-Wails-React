import Swal from "sweetalert2";

const handleAddTypeActivity = (setCategories, setActivityType) => {
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
    didOpen: () => {
      // Добавляем кнопку "Редактировать" рядом с другими кнопками
      const actions = Swal.getActions();
      const editButton = document.createElement('button');
      editButton.textContent = 'Редактировать';
      editButton.classList.add('swal2-edit-button'); // Добавляем класс для стилизации
      editButton.addEventListener('click', () => {
        Swal.fire({
          title: "Редактирование категории",
          input: "text",
          inputAttributes: {
            autocapitalize: "off",
            placeholder: "Введите новое название категории",
          },
          showCancelButton: true,
          confirmButtonText: "Сохранить",
          showLoaderOnConfirm: true,
          preConfirm: (updatedCategory) => {
            if (!updatedCategory) {
              Swal.showValidationMessage("Название категории не может быть пустым!");
              return false;
            }
            return updatedCategory;
          },
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            const updatedCategory = result.value;

            window.go.main.App.UpdateCategory(updatedCategory)
              .then(() => {
                setCategories((prevCategories) => 
                  prevCategories.map(cat => cat === newCategory ? updatedCategory : cat)
                );
                setActivityType(updatedCategory);

                Swal.fire({
                  title: "Успешно!",
                  text: `Категория "${updatedCategory}" обновлена.`,
                  icon: "success",
                });
              })
              .catch((error) => {
                Swal.fire({
                  title: "Ошибка",
                  text: `Не удалось обновить категорию: ${error}`,
                  icon: "error",
                });
              });
          }
        });
      });

      // Вставляем кнопку "Редактировать" перед кнопкой "Отмена"
      actions.insertBefore(editButton, actions.querySelector('.swal2-cancel'));
    },
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

export default handleAddTypeActivity;