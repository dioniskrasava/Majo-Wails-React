//  Утилиты для работы со временем.

export const setCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  
  export const calculateTotalTime = (startTime, endTime) => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  
    if (!timePattern.test(startTime)) {
      throw new Error("Некорректный формат времени начала.");
    }
    if (!timePattern.test(endTime)) {
      throw new Error("Некорректный формат времени окончания.");
    }
  
    const startDate = new Date(`1970-01-01T${startTime}Z`);
    const endDate = new Date(`1970-01-01T${endTime}Z`);
    const diffInMs = endDate - startDate;
  
    if (diffInMs < 0) {
      throw new Error("Время окончания не может быть меньше времени начала.");
    }
  
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;
  
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };