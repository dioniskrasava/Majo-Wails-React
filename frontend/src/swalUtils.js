import Swal from 'sweetalert2';

export const showSuccessAlert = (title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    showClass: {
      popup: 'swal2-show', // Анимация появления
    },
    hideClass: {
      popup: 'swal2-hide', // Анимация исчезновения
    },
    timer: 1500, // Автоматическое закрытие через 1.5 секунды
    timerProgressBar: true, // Показывать прогрессбар таймера
    didOpen: () => {
      Swal.getPopup().style.transition = 'transform 0.1s ease-out'; // Ускорение анимации
    },
  });
};